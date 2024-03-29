import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import {AuthProvider} from "./auth/AuthProvider";
import LoginComponent from "./auth/LoginComponent";
import {CardProvider} from "./components/CardProvider";
import {PrivateRoute} from "./auth/PrivateRoute";
import Home from "./pages/Home";
import CardDetails from "./pages/CardDetails";

const App: React.FC = () => (
    <IonApp>
        <IonReactRouter>
            <IonRouterOutlet>
                <AuthProvider>
                    <Route path="/login" component={LoginComponent} exact={true}/>
                    <CardProvider>
                        <PrivateRoute path="/home" component={Home} exact={true}/>
                        <PrivateRoute path="/card" component={CardDetails} exact={true}/>
                        <PrivateRoute path="/card/:id" component={CardDetails} exact={true}/>
                    </CardProvider>
                    <Route exact path="/" render={() => <Redirect to="/home"/>}/>
                </AuthProvider>
            </IonRouterOutlet>
        </IonReactRouter>
    </IonApp>
);

export default App;
