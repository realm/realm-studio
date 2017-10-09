import * as React from 'react';
import {
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
} from 'reactstrap';

export const SignupOverlay = ({
  email,
  isVisible,
  newsletter,
  onEmailChange,
  onNewsletterChange,
  onSignup,
  onSkip,
}: {
  email: string;
  isVisible: boolean;
  newsletter: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNewsletterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSignup: () => void;
  onSkip: () => void;
}) => (
  <Modal isOpen={isVisible} className="Greeting__SignupOverlay">
    <form
      onSubmit={e => {
        e.preventDefault();
        onSignup();
      }}
    >
      <ModalBody>
        <h5>Thanks for using Realm Studio!</h5>
        <p>We would love to get in touch with you.</p>
        <FormGroup>
          <Input
            id="email"
            name="email"
            onChange={onEmailChange}
            placeholder="Your e-mail address"
            required
            type="email"
            value={email}
          />
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input
              checked={newsletter}
              name="newsletter"
              onChange={onNewsletterChange}
              type="checkbox"
            />
            &nbsp;Send me product updates
          </Label>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onSkip}>Skip</Button>
        <Button color="primary">Let's get started!</Button>
      </ModalFooter>
    </form>
  </Modal>
);
