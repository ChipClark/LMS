import { Component, ComponentFactoryResolver } from '@angular/core';
import { HttpClient } from'@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Personnel Directory';
  private authRslt: string = '';
  private authBack: string = 'grey';
  private postRslt: string = '';
  private postBack: string = 'grey';

  public working_db = false;  // false = external db

  constructor (
    private http: HttpClient
    ){};

  
  
  ngOnInit() {
  
  }

  
}
