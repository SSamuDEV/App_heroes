import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

// Es el padre que nos llevará a las dos hijas principales.

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule ),
    //canMatch: [ LoginGuard ],
    //canActivate: [ LoginGuard ],
  },
  {
    path: 'heroes',
    loadChildren: () => import('./heroes/heroes.module').then( m => m.HeroesModule ),
    // Está para que pase por aquí antes de pasar por esta ruta.
     canMatch: [ AuthGuard ],
     canActivate: [ AuthGuard ],
  },
  {
    path: '404',
    component: Error404PageComponent
  },
  {
    path: '',
    redirectTo: 'heroes',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '404'
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
