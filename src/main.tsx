
import { definePlugin, PanelSection, Button } from "decky-frontend-lib";
import QRCode from "qrcode.react";
import { useEffect, useState } from "react";

export default definePlugin(() => {
  const [serverIP, setServerIP] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [running, setRunning] = useState(false);

  const fetchIP = async () => {
    const res = await deckyPlugin.callBackend("get_ip", {});
    setServerIP(res.ip);
  };

  const startServer = async () => {
    await deckyPlugin.callBackend("start_server", {});
    await fetchIP();
    setRunning(true);
  };

  const stopServer = async () => {
    await deckyPlugin.callBackend("stop_server", {});
    setRunning(false);
  };

  return (
    <PanelSection title="Decky Chat Server">
      <Button onClick={running ? stopServer : startServer}>
        {running ? "Stop Server" : "Start Server"}
      </Button>
      {running && (
        <>
          <Button onClick={() => setShowQR(!showQR)}>
            {showQR ? "Hide QR" : "Show QR"}
          </Button>
          {showQR && <QRCode value={`http://${serverIP}:8765/client/`} />}
        </>
      )}
    </PanelSection>
  );
});
