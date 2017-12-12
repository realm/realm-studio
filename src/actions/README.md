# Actions

The actions has been implemented to enable a typed request + response API on top of Electrons IPC.

It consists of the following parts:
1. **ActionSender** is an abstract class that gets specialized to provide a typed API and loaded by any part that wants
   to send actions to a particular other part of the system. It uses the electron IPC to first send a request and later
   receive a response from the appropriate receiver.
2. **ActionReceiver** is an abstract class that responds to specific IPC messages and calls handlers on the receiving
   side of the typed interface. The handlers return promises that sends back a response to the sender when resolved.
3. **Transport** is an event emitting abstract class that defines the interface for sending and receiving requests and
   responses. Three specialized implementations of this exists:
   1. **LoopbackTransport** is a loopback implementation that sends and receives to itself - use this for tests or to
      provide a unified interface between parts that can be accessed from the part itself.
   2. **MainTransport** is an implementation used by the main process to send and receive requests and responses to /
      from a specific renderer process (actually its underlying `Electron.WebContents`). It receives request and
      response messages by registering a listener using `electron.ipcMain.on(...` and sends using
      `webContents.send(...`.
   3. **RendererTransport** is an implementation used by a renderer process (ie. browser window) to send and receive
      requests and responses to / from the main process. It uses `electron.ipcRenderer.on(` to receive requests and
      responses and `electron.ipcRenderer.send(` to send request and responses to the main process.
4. **main/Sender** implements a typed `ActionSender` that send requests to and returns responses from the main process.
   It basically wraps each of the enumerated `MainActions` from `/src/main/MainActions`.
