import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageComponent }      from './page/page.component';
import { SubpageComponent } from './subpage/subpage.component';
// import { DialogWindow } from './opendialog/opendialog.component';
//import { homedir } from 'os';


const routes: Routes = [
  { path: 'root', component: PageComponent },
  { path: '', component: PageComponent, pathMatch: 'full' },
  { path: 'Subpage_Editor', component: SubpageComponent},
  // { path: 'icons', component: DialogWindow }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule]
})
export class AppRoutingModule { 

}
