
import { createRoot } from "react-dom/client";
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import App from "./App";
import "./index.css";

const manifestUrl = 'https://4a6a4d09-c68b-481c-9974-30fc162da62a-00-35hnxvckxlwnb.riker.replit.dev/tonconnect-manifest.json';

createRoot(document.getElementById("root")!).render(
  <TonConnectUIProvider 
    manifestUrl={manifestUrl}
    actionsConfiguration={{
      twaReturnUrl: 'https://4a6a4d09-c68b-481c-9974-30fc162da62a-00-35hnxvckxlwnb.riker.replit.dev'
    }}
  >
    <App />
  </TonConnectUIProvider>
);
