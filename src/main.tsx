
import { definePlugin, PanelSection, Button } from "decky-frontend-lib";
import QRCode from "qrcode.react";
import { useEffect, useState } from "react";

const WebSocketURL = `ws://${window.location.hostname}:8765`;

export default definePlugin(() => {
  const [serverIP, setServerIP] = useState("");
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await deckyPlugin.callBackend("get_ip", {});
      setServerIP(res.ip);
    })();
  }, []);

  const url = `http://${serverIP}:8765/client/`;

  return (
    <PanelSection title="Decky Chat QR">
      <Button onClick={() => setShowQR(!showQR)}>
        {showQR ? "Hide QR" : "Show QR"}
      </Button>
      {showQR && <QRCode value={url} />}
    </PanelSection>
  );
});
