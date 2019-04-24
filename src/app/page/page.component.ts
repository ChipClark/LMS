// page.components.ts

import { Component, OnInit, Input, ViewEncapsulation, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl, SafeValue } from '@angular/platform-browser';
import { Page, Tags, assoc_top_tag, SubPage, Thumbnails } from '../datatables/page';
// import { DialogWindow } from '../opendialog/opendialog.component'
import { FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '../api.service';
import { AppComponent } from '../app.component';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParseSourceSpan } from '@angular/compiler';
import { getTreeNoValidDataSourceError } from '@angular/cdk/tree';
// import { AnyARecord } from 'dns';
// import { MdCheckboxModule } from '@angular/material';

// datatables 


@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./page.component.css'],
})

@Injectable({
  providedIn: 'root'
})


export class PageComponent implements OnInit {

  public internal = true;    // change to false to use external db
  public external = false;
  
  //includes

  @ViewChildren('nGForArray')filtered;
  @ViewChildren('formPage') formValues;

  public tags: any;
  public tag = null;
  public searchTerm = null;
  public tagname: any;
  public title;
  public description;
  public icon;
  public isactive;
  public sidebar;
  public id;
  
  public isPageFormVisible = false;
  public isCurrent = false;

  url: string;
  top_page: Page[];
  currentPage: any[];
  tagsArray: Tags[];
  tagsSelect: Array<Tags> = [];
  subpage: SubPage[];
  connect_tags: assoc_top_tag[];
  formPage: FormGroup; 
  thumbnails: Thumbnails[];
  

  
  //completePerson: PersonPage[];
  router: RouterLink;

  constructor(
    private apiService: APIService,
    private modalService: NgbModal,
    private mainApp: AppComponent,
    private http: HttpClient,
    protected sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private _router: Router,
    // private dialog: DialogWindow,
    private location: Location
  ) { }

  ngOnInit() {
    this.getData();
    this.getParams();
  }

  addQueryParams(query): void {
    const keys = Object.keys(query);
    const values = Object.values(query);
    for (let i = 0; i < keys.length; i++) {
      switch (keys[i]) {
        case 'tag':
          this.tag = values[0];
          break;
      }
    }
    if (keys[0] === 'tag') {

      this._router.navigate(['edit'], {
        queryParams: {
          ...query
        }
      });
    } else {
      if (query === "") {
        query = null;
      }
      this._router.navigate(['edit'], {
          queryParams: {
            ...query
          },
          queryParamsHandling: 'merge',
        });
    }
  }

  clearFilters() {
    this.searchTerm = null;
    this.tags = null;
  }

  clearForm(): void {
    this.title = "";
    this.description = "";
    this.icon = "";
    this.isactive = null;
    this.sidebar = null;
    this.id = null;
    this.clearCheckedTags()
  }

  clearCheckedTags(): void {
    for(let i = 0; i < this.tagsArray.length; i++) {
      this.tagsArray[i].isChecked = false;
    }
  }

  clickTag(tag: string): void {
    console.log(tag);
  }

  createRequest(): void {
    if (this.isactive = "true") {
      this.isactive = true;
    }
    else this.isactive = false;
    
    const body = {
      "title": this.title,
      "description": this.description,
      "icon": this.icon,
      "sidebar": this.sidebar,
      "isactive": this.isactive,
    };

    this.apiService.postPageData(body)
      .subscribe(
        res => console.log('HTTP response', res),
        err => console.log('HTTP Error', err),
        () => console.log('HTTP request completed.'),
      );
    
    this.updateTags();
    this.clearForm();
  }

  deleteRequest(): void {
    this.apiService.removePageData(this.id)
      .subscribe(
        (p: any) => {
          p = this.top_page;
        }
      );
    var tempTag: assoc_top_tag[];
  
    tempTag = this.connect_tags.filter( t => {
      return t.pageid === this.id
    });                                                   //  These are the existing tags for the page

    for (let i = 0; i < tempTag.length; i++) {
      this.apiService.removeConnectTags(tempTag[i].id)
    }
    

  }

  executeQueryParams(queryStrings): void {
    const queries = Object.entries(queryStrings);
    this.clearFilters();
    for (const q of queries) {
      switch (q[0]) {
        case 'tag':
          this.tag = q[1];
          break;
        case 'search':
          this.searchTerm = q[1];
          break;

      }
    }
  }


  fillform(single_page): void {
    this.clearCheckedTags()
    this.isPageFormVisible = true;
    this.title = single_page.title;
    this.description = single_page.description;
    this.icon = single_page.icon;
    this.isactive = single_page.isactive;
    this.sidebar = single_page.sidebar;
    this.id = single_page.id
    this.isCurrent = true;
    this.tagsSelect = single_page.tags;
    var i;

    for (i = 0; i < this.tagsSelect.length; i++) {
      for (let j = 0; j < this.tagsArray.length; j++) {
        if (this.tagsSelect[i].id == this.tagsArray[j].id) {
          this.tagsArray[j].isChecked = true;
        }
      }
    }
  }

  fillIcon(icon: string): void {
    this.icon = icon;
  }

  getData(): any {
    //console.log(this.baseURL);
    this.apiService.getPageData(this.mainApp.internal_db)
      .subscribe(top_page => {
        this.top_page = top_page;
        //console.log(this.top_page);
      });
    this.apiService.getTagData(this.mainApp.internal_db)
      .subscribe(tagArray => {
        this.tagsArray = tagArray;
      });
    
    this.apiService.getSubpageData(this.mainApp.internal_db)
      .subscribe(subpage => {
        this.subpage = subpage;
      });
    this.apiService.getConnectTags(this.mainApp.internal_db)
      .subscribe(connect_tags => {
        this.connect_tags = connect_tags;
      });

    this.apiService.getIcons()
      .subscribe(thumbnails => {
        this.thumbnails = thumbnails;
      });
  }

  getParams(): void {
    this.route.queryParamMap.subscribe(params => {
      const queryStrings: any = this.route.queryParamMap;
      this.executeQueryParams(queryStrings.source.value);
    });
  }

  getTags(page): string {
    var pagetags = "";
    if (page.tags) {
      for (let i = 0; i < page.tags.length; i++) {
        pagetags = pagetags + (page.tags[i].tag);
        if (page.tags[i + 1]) {
          pagetags = pagetags + ", ";
        }
      }
    }
    return pagetags;
  }

  openWindow(content): void {
    this.modalService.open(content);
  }

  tagChecked(tag: string): void {
    for(let i = 0; i < this.tagsArray.length; i++) {
      if (this.tagsArray[i].tag == tag) {
        this.tagsArray[i].isChecked = !this.tagsArray[i].isChecked;
      }
    }
  }

  updateRequest(): void {
    var tID;
    if (this.isactive = "true") {
      this.isactive = true;
    }
    else this.isactive = false;

    const body = {
      "id": this.id,
      "title": this.title,
      "description": this.description,
      "icon": this.icon,
      "sidebar": this.sidebar,
      "isactive": this.isactive,
    };

    this.apiService.updatePageData(body)
      .subscribe(
        (p: any) => { p = this.top_page; }
      )

    this.updateTags();
  
  }

  updateTags(): void {
    var i, j;
    var tempTag: assoc_top_tag[];
    
    tempTag = this.connect_tags.filter( t => {
      return t.pageid === this.id
    });                                                   //  These are the existing tags for the page

    for (i = 0; i < tempTag.length; i++ ) {               //  Sets the tag update status as true (yes, it is up-to-date)
      tempTag[i].update = true;
    }                                                     

    this.tagsSelect = [];                                 // clear the array 
    for (let i = 0; i < this.tagsArray.length; i++) {
      if (this.tagsArray[i].isChecked == true) {
        this.tagsSelect.push(this.tagsArray[i])
      } 
    }                                                     //  These are all the tags to be updated

    for (i = 0; i < this.tagsSelect.length; i++) {
      for (j = 0; j < tempTag.length; j++) {
        if (this.tagsSelect[i].id == tempTag[j].tagid) {
          this.tagsSelect[i].isChecked = false;           //  No need to update if page and tagid already exist 
          tempTag[j].update = false;                      //  No need to update if page and tagid already exist 
        }
      }
    }
    
    for (i = 0; i < tempTag.length; i++) {
        if (tempTag[i].update == true) {
          const tagBody = {
              '"pageid"': this.id,
              '"tagid"': tempTag[i].tagid
            }
          console.log(tagBody);
          this.apiService.postConnectTags(tagBody)
            .subscribe(
              res => console.log('HTTP response', res),
              err => console.log('HTTP Error', err),
              () => console.log('HTTP request completed.')
            );
        }
        if (tempTag[i].update == false) {
          const tagBody = {
            '"delete"': "disconnect the following",
            '"pageid"': this.id,
            '"tagid"': tempTag[i].tagid
            }
            console.log(tagBody);
          this.apiService.removeConnectTags(tempTag[i].id)
            .subscribe(
              res => console.log('HTTP response', res),
              err => console.log('HTTP Error', err),
              () => console.log('HTTP request completed.')
            );
        }
    }

    for (i = 0; i < this.tagsSelect.length; i++) {
      if (this.tagsSelect[i].isChecked == true) {
        const tagBody = {
              '"pageid"': this.id,
              '"tagid"': this.tagsSelect[i].id
          }
        console.log(tagBody);
        this.apiService.postConnectTags(tagBody)
          .subscribe(
            res => console.log('HTTP response', res),
            err => console.log('HTTP Error', err),
            () => console.log('HTTP request completed.')
          );
      }
    }
  }

}
