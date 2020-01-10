////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import electron from 'electron';
import { URL } from 'url';

export class CertificateManager {
  private trustedFingerprints: string[] = [];

  constructor() {
    electron.app.addListener('certificate-error', this.onCertificateError);
  }

  public destroy() {
    electron.app.removeListener('certificate-error', this.onCertificateError);
  }

  /*
   * This handler gets called whenever the native fetch API encounters a SSL certificate error.
   */
  public onCertificateError = async (
    event: any,
    webContents: electron.WebContents,
    url: string,
    error: string,
    certificate: electron.Certificate,
    callback: (isTrusted: boolean) => void,
  ) => {
    event.preventDefault();
    // Check if this fingerprint is already trusted
    if (this.trustedFingerprints.indexOf(certificate.fingerprint) !== -1) {
      callback(true);
    } else {
      const window = electron.BrowserWindow.fromWebContents(webContents);
      const isTrusted = await this.showCertificateTrustDialog(
        window,
        url,
        certificate,
        // The showCertificateTrustDialog is not supported on Linux
        process.platform !== 'linux',
      );
      if (isTrusted) {
        this.trustedFingerprints.push(certificate.fingerprint);
      }
      callback(isTrusted);
    }
  };

  private describeCertificate(certificate: electron.Certificate) {
    return [
      `Fingerprint: ${certificate.fingerprint}`,
      `Subject: ${certificate.subjectName}`,
      `Issuer: ${certificate.issuerName}`,
    ].join('\n');
  }

  private async showCertificateTrustDialog(
    window: electron.BrowserWindow,
    url: string,
    certificate: electron.Certificate,
    enableDetailedButton: boolean = true,
  ): Promise<boolean> {
    const parsedUrl = new URL(url);
    const coreMessage = `The server (${parsedUrl.host}) is using a certificate that cannot be automatically trusted.`;
    const description = this.describeCertificate(certificate);
    const buttons = ['Yes - I trust it!', 'No!'];
    if (enableDetailedButton) {
      buttons.push('Show certificate details');
    }
    // Show the message box
    const response = await electron.dialog.showMessageBoxSync(window, {
      type: 'warning',
      message: `${coreMessage}\n\n${description}\n\nDo you trust this certificate?`,
      buttons,
    });
    if (enableDetailedButton && response === 2) {
      await electron.dialog.showCertificateTrustDialog(window, {
        certificate,
        message: coreMessage,
      });
      return this.showCertificateTrustDialog(window, url, certificate, false);
    }
    // Return true when trusted
    return response === 0;
  }
}
