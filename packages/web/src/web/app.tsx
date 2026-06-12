import { Route, Switch } from "wouter";
import { Provider } from "./components/provider";
import { AgentFeedback } from "@runablehq/website-runtime";
import Index from "./pages/index";
import Dashboard from "./pages/dashboard";
import Devices from "./pages/devices";
import Alerts from "./pages/alerts";
import Reports from "./pages/reports";
import Pricing from "./pages/pricing";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  return (
    <Provider>
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/devices" component={Devices} />
        <Route path="/alerts" component={Alerts} />
        <Route path="/reports" component={Reports} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}

    </Provider>
  );
}

export default App;
