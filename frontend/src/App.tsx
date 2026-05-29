import { Route, Redirect } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthProvider } from './context/AuthContext';
import Index from './pages/Index';
import Login from './pages/Login';
import Home from './pages/Home';
import Perfil from './pages/Perfil';
import Asignaturas from './pages/Asignaturas';
import AsignaturaDetalle from './pages/AsignaturaDetalle';
import NotaDetalle from './pages/NotaDetalle';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';

import './theme/variables.css';
import './theme/global.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/login" component={Login} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/perfil" component={Perfil} />
          <Route exact path="/asignaturas" component={Asignaturas} />
          <Route exact path="/asignaturas/:id" component={AsignaturaDetalle} />
          <Route exact path="/asignaturas/:idAsignatura/notas/:idNota" component={NotaDetalle} />
          <Route exact path="/" component={Index} />
          <Route>
            <Redirect to="/" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </AuthProvider>
  </IonApp>
);

export default App;
