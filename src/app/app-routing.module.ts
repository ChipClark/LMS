import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageComponent }      from './page/page.component';
import { SubpageComponent } from './subpage/subpage.component';
//import { homedir } from 'os';


const routes: Routes = [
  { path: 'root', component: PageComponent },
  { path: '', component: PageComponent, pathMatch: 'full' },
  { path: 'course/:title', component: SubpageComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule]
})
export class AppRoutingModule { 


  
}
