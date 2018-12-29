// people.compenents.ts

import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl, SafeValue } from '@angular/platform-browser';
import { Person } from '../person';
import { iData, APIHeader } from '../JUNK';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { APIService } from '../api.service';
import { RouterLink } from '@angular/router';

// datatables 
import { PersonPage } from '../datatables/AllTextFields';
import { Schools } from '../datatables/school';
import { Phones } from '../datatables/phones';
import { JobTitle, JobTypes } from '../datatables/jobs';
import { Photos } from '../datatables/photo';
import { LegalPractices, AttorneyPracticeAreas, LegalSubPractices, License, LicenseType } from '../datatables/practicestables';
import { HRDepartments, LegalDepartments, LegalSubDepartments } from '../datatables/departmenttables';
import { PersonRelationship } from '../datatables/personrelationship';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { ACTIVE_INDEX } from '@angular/core/src/render3/interfaces/container';
import { PersonSearchComponent } from '../person-search/person-search.component';
import { identifierModuleUrl } from '@angular/compiler';


@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
})

@Injectable({
  providedIn: 'root'
})

export class PeopleComponent implements OnInit {

  public baseURL = 'http://am-web05:3030/api/v1/people/';
  
  // Filters
  public activepeopleFilter = '?filter={"where":{"employmentstatus":"A"},'
  public All = this.activepeopleFilter;
  public addFilter = this.All;


  //includes
    private officeFilter = '"emails","phones","jobtitle","officelocation","hrdepartment","photo","personrelationship"';
    private practiceFilter = '"attorneypractices","practices","legalsubdepartments","licenses","licensetype"';
    private educationFilter = '"education","schools","degreetypes"';
    public generalIncludes = '"include":[' + this.officeFilter + ',' + this.practiceFilter + ']';
    public endRequest = '}';
  
  private order = '"order":"lastname ASC",'
  public personURL = this.baseURL + this.activepeopleFilter + this.order + this.generalIncludes + this.endRequest;

  private cityLabelID = "city6";
  private roleLabelID = "Role1";
  private alphaLabelID = "alphaAll";
  private CPRNotary = 'clear';
  public hrdepartmentFilter = "";
  public cprImg = '<img src="../assets/cpr.png" class="cprimg" data-toggle="tooltip" title="CPR Certified" width="25px;">';
  public notaryImg = '<img src="../assets/notary.png" class="notaryimg" data-toggle="tooltip" title="Notary Public" width="25px;">';
  
  public pageNumber = 0;
  public limit = 10;
  public records;
  public lastRecord;
  public lastPage;
  
  

  url: string;
  people: Person[];
  completePerson: PersonPage[];
  sortPeople: Person[];
  activePeople: Person[];
  relationships: PersonRelationship[];
  school: Schools[];
  phone: Phones[];
  router: RouterLink;
  jobs: JobTitle[];
  hrdepts: HRDepartments[];
  attorneyareas: AttorneyPracticeAreas[];
  practiceareas: LegalPractices[];
  subpracticeareas: LegalSubPractices[];
  roles: HRDepartments[];
  legalDepts: LegalDepartments[];
  legalSubDepts: LegalSubDepartments[];
  license: License[];
  licensetype: LicenseType[];
  photo: Photos[];
  
  constructor(
    private staffService: APIService,
    private http: HttpClient,
    protected sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.getPeople();
  }

  ngOnDestroy() {
    this.staffService.people = this.people;
  }

  getPeople(): any {
    this.buildURL();
    this.staffService.getDATA(this.personURL)
      .subscribe(people => { 
        //console.log(this.personURL);
        this.people = people;
        this.activePeople = people;
        this.sortPeople = people;
        this.records = this.people.length;
        this.lastRecord = this.people.length;
        this.lastPage = Math.ceil(this.lastRecord / this.limit);
        //this.buildCompletePerson();
      }
    );
  }

  buildCompletePerson(): any {

    var tempTable: any;

    if (!this.people) console.log("No People[]");

    for (let i=0; i < 1; i++) {
      this.completePerson[i].addomainaccount = this.people[i].addomainaccount;
      this.completePerson[i].pkpersonid = this.people[i].pkpersonid;
      this.completePerson[i].personguid = this.people[i].personguid;
      this.completePerson[i].lastname = this.people[i].lastname;
      this.completePerson[i].firstname = this.people[i].firstname;
      this.completePerson[i].middlename = this.people[i].middlename;
      this.completePerson[i].preferredfirstname = this.people[i].preferredfirstname ;
      this.completePerson[i].displayname = this.people[i].displayname;
      this.completePerson[i].initials = this.people[i].initials;
      this.completePerson[i].prefix = this.people[i].prefix;
      this.completePerson[i].suffix = this.people[i].suffix;
      this.completePerson[i].timekeepernumber = this.people[i].timekeepernumber ;
      this.completePerson[i].ultiproemployeeid = this.people[i].ultiproemployeeid;
      this.completePerson[i].addomainaccount = this.people[i].addomainaccount;
      this.completePerson[i].adprincipaldomainaccount = this.people[i].adprincipaldomainaccount;
      this.completePerson[i].officenumber = this.people[i].officenumber;
      
      tempTable = this.hrdepts.find(obj => obj.hrdepartmentid === this.people[i].hrdepartmentid);
        this.completePerson[i].hrdepartmentname = tempTable.hrdepartmentname;

      tempTable = this.jobs.find(obj => obj.jobtitleid ===this.people[i].jobtitleid  );
        this.completePerson[i].jobtitle = tempTable.jobtitle;
      
      //tempTable = this.
      //this.completePerson[i].officelocationname = this.people[i].addomainaccount;
  
    }
    
  }

  usePeople(): any {
    return this.people;
  }
  
  buildURL() {
    this.personURL = this.baseURL + this.activepeopleFilter + this.order + this.generalIncludes + this.endRequest;  // URL to web api
  }

  getIndividual(id: number): void {
    this.activePeople = this.people.filter(p => {
      return p.pkpersonid === id
    });
  }

  getTitles(currentperson: any): string {
    var currentJobTitle = currentperson.jobtitle.jobtitle;
    
    var addHTML = "<strong>" + currentJobTitle + "</strong>";
    var attorneyPracName = "No legalsubdeptfriendlyname"

    if (currentperson.isattorney == true) {
      addHTML = addHTML + '<br>'

      if (!currentperson.legalsubdepartments) { 
      }
      else {
        attorneyPracName = currentperson.legalsubdepartments.legalsubdeptfriendlyname;
      }
      
      addHTML = addHTML + attorneyPracName;
    }
    return addHTML;
  }

  getPhoto(photodata: any): SafeHtml {
    // this isn't working yet  - photos getting put into database ...
    // no need for extensive logic 
    var photoString, photoURL: any;

    if (photodata.length==0) {
      photoString =  '<img src="http://amjabber/nophoto.gif" id="no photo" width="112px;" />'
    }
    else {

      photoURL = photodata[0].photolocationpath + photodata[0].photofilename;
      photoString = '<img src="' + photoURL + '" id="' + photodata[0].photofilename + '" width="112px;" />';
    }
    
      
    return this.sanitizer.bypassSecurityTrustHtml(photoString);
  }

  getEmail(EMAIL: string, personName: string): string {
    var emailString = '<a href=mailto:' + EMAIL + ' id=' + personName + ' >' + EMAIL + '</a>'; 
  
    return emailString;
  }

  getPrefName(prefName: string): string {
    if (!prefName) return "";
    prefName = '"' + prefName + '"';    
    return prefName;
  }

  getPhone(currentperson: any): SafeHtml | SafeValue {
    var phonetypeid = 1;
    var officePhone = currentperson.phones.find(obj => { 
      return obj.phonetypeid === phonetypeid;
    });

    if (!officePhone) {
      var nophone = 'Phone: NO EXTENSION NUMBER<br>'
      return nophone; 
    }

    var phonenum = officePhone.phonenumber;
    phonenum = phonenum.replace(/\D+/g, '')
          .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

    phonenum = 'Phone: <a href="tel:+' + officePhone.phonenumber + '" data-toggle="tooltip" title="call ' + currentperson.displayname + '">' + phonenum + '</a><br>'
    return this.sanitizer.bypassSecurityTrustHtml(phonenum);
  }

  getAssistant(currentperson: any): SafeHtml {
    var assistants: Person;
    var attorneys: Person[];
    var asst;
    
    if (currentperson.personrelationship.length == 0) {
      attorneys = this.people.filter(obj => { 
        if (obj.personrelationship.length > 0) {
          return obj.personrelationship[0].relatedpersonid === currentperson.pkpersonid;
        }
      });

      if (attorneys.length == 0) return null;

      asst = "Secretary for: <br>"
      
      for (let i = 0; i < attorneys.length; i++){
        var detailURL = '<a href="#" class="" (click)="' 
        + 'getIndividual(' + attorneys[i].pkpersonid + ')" data-toggle="tooltip" title="see more about ' 
        + attorneys[i].displayname + '" >';
        if (i == 0 ) {
          asst = asst + detailURL + attorneys[i].displayname + '</a>';
        }
        else {
          asst = asst + ',&nbsp;' + detailURL + attorneys[i].displayname + '</a>';
        }
      };

      return this.sanitizer.bypassSecurityTrustHtml(asst);
    }

    var asstID = currentperson.personrelationship[0].relatedpersonid;
    

    assistants = this.people.find(obj => { 
      return obj.pkpersonid === currentperson.personrelationship[0].relatedpersonid;
    });
 
    for (let i = 0; i < currentperson.personrelationship.length; i++){
      asst = 'Assistant: ';

      for (let j = 0; j < this.people.length; j++) {
        if (currentperson.personrelationship[i].relatedpersonid == this.people[j].pkpersonid) {
          assistants = this.people[j];

          if (!assistants.displayname) {
            asst = asst + 'No name found';
          }
          else {
            var detailURL = '<button href="#" class="" (click)="' 
              + 'getIndividual(' + assistants.pkpersonid 
              + ')" data-toggle="tooltip" title="see more about ' 
              + assistants.displayname + '" >';
            asst  = asst + detailURL + assistants.displayname;
          }
    
        }
      }
    }
    asst = asst + '</button><br />';
    return this.sanitizer.bypassSecurityTrustHtml(asst);
  }

  onSearchChange(search: string): void {
    // add to filter to search both names, city, practice areas
    const regExp = new RegExp(search, 'gi');
    const check = obj => {
      if (obj !== null && typeof obj === 'object') { return Object.values(obj).some(check); }
      if (Array.isArray(obj)) { return obj.some(check); }
      return (typeof obj === 'string' || typeof obj === 'number') && regExp.test(obj);
    };
    this.activePeople = this.people.filter(check);
  }
  
  ifCPR(currentperson: any): SafeHtml {
    var _element, i;
    
    for (i=0; i < currentperson.licensetype.length; i++) {
      if (currentperson.licensetype[i].licensetypeid == 3){
          _element = this.cprImg;
          return this.sanitizer.bypassSecurityTrustHtml(_element);
      }
    }
    return null;
  }

  ifNotary(currentperson: any): SafeHtml {
    var _element, i;
    for (i=0; i < currentperson.licensetype.length; i++) {
      if (currentperson.licensetype[i].licensetypeid == 2){
        _element = this.notaryImg;
        return this.sanitizer.bypassSecurityTrustHtml(_element);
      }
    }
    return null;
  }


  sanitizeScript(sanitizer: DomSanitizer) {}
  
  ByLocation(id: string): void {
    var LabelElement, locationID;
    LabelElement = document.getElementById(this.cityLabelID);
    LabelElement.className = "normal-font  btn btn-outline-secondary";

    switch (id) {
      case "city6":
          locationID = null;
          LabelElement = document.getElementById("city6");
          this.cityLabelID = "city6";
         break;
      case "city1": 
          locationID = 4;
          LabelElement = document.getElementById("city1");
          this.cityLabelID = "city1";
         break;
      case "city2":
          locationID = 1;
          LabelElement = document.getElementById("city2");
           this.cityLabelID = "city2";
         break;
      case "city3":
          locationID = 2;
          LabelElement = document.getElementById("city3");
           this.cityLabelID = "city3";
         break;
      case "city4":
          locationID = 3;
          LabelElement = document.getElementById("city4");
          this.cityLabelID = "city4";
         break;
      case "city5":
          locationID = 5;
          LabelElement = document.getElementById("city5");
          this.cityLabelID = "city5";
         break;
      default: 
          locationID = null;
        break;
    }
    LabelElement.className = "normal-font btn btn-outline-secondary active";

    if (locationID == null) {
      this.activePeople = this.people;
    }
    else {
      this.activePeople = this.people.filter(obj => {    
        return obj.officelocationid === locationID});
    }
    this.pageNumber = 0;
    this.clearRole();
    this.clearAlpha();
    this.clearCPRNotary();
  }

  clearLocation(): void {
    var _element
    _element = document.getElementById(this.cityLabelID);
    _element.className = "normal-font btn btn-outline-secondary";

    _element = document.getElementById("city6");
    _element.className = "normal-font btn btn-outline-secondary active";
    this.cityLabelID = "city6";

  }

  ByCPRNotary(id: string): void {
    var _element, licensetypeid, i;
    _element = document.getElementById(this.CPRNotary);
    _element.className = "normal-font  btn btn-outline-secondary";

    switch (id) {
      case "clear":
          licensetypeid = null;
          _element = document.getElementById("clear");
          this.CPRNotary = "clear";
         break;
      case "CPR": 
          licensetypeid = 3;
          _element = document.getElementById("CPR");
          this.CPRNotary = "CPR";
         break;
      case "Notary":
          licensetypeid= 2;
          _element = document.getElementById("Notary");
           this.CPRNotary = "Notary";
         break;
      
      default: 
          licensetypeid = null;
        break;
    }
    _element.className = "normal-font btn btn-outline-secondary active";


    if (licensetypeid == null) {
      this.activePeople = this.people;
    }
    else {
      this.activePeople = this.people.filter(obj => {
        for (i=0; i < obj.licensetype.length; i++) {
          return obj.licensetype[i].licensetypeid === licensetypeid;
          };
      });
    }
    this.pageNumber = 0;
    this.clearRole();
    this.clearAlpha();
    this.clearLocation();
  }

  clearCPRNotary(): void {
    var _element
    _element = document.getElementById(this.CPRNotary);
    _element.className = "normal-font btn btn-outline-secondary";

    _element = document.getElementById("clear");
    _element.className = "normal-font btn btn-outline-secondary active";
    this.CPRNotary = "clear";

  }

  ByRole(role: string): void {
    var LabelElement, hrdept;
    LabelElement = document.getElementById(this.roleLabelID);
    LabelElement.className = "med-font btn btn-outline-secondary";

    switch (role) {
        case "Role1":
          //  hrdept = null;
          this.sortPeople = this.people;
          this.activePeople = this.sortPeople;
          LabelElement = document.getElementById("Role1");
          this.roleLabelID = "Role1";
         break;
        case "Role2": 
          //  hrdept = 13; //"Partners"  hrdept = 1; //"Associates" 

          this.activePeople = this.sortPeople.filter(obj => {    
            return obj.isattorney === true});
          LabelElement = document.getElementById("Role2");
          this.roleLabelID = "Role2";
         break;
      case "Role3":

          this.activePeople = this.sortPeople.filter(obj => {    
            return obj.isattorney === false && obj.hrdepartmentid != 9 });
          LabelElement = document.getElementById("Role3");
          this.roleLabelID = "Role3";
         break;
      case "Role4":
          this.activePeople = this.sortPeople.filter(obj => {    
            return obj.hrdepartmentid === 9 });
          LabelElement = document.getElementById("Role4");
          this.roleLabelID = "Role4";
         break;

      //  shouldn't reach any of these     
      case "Role5":
          hrdept = 9; //"Administration"
          LabelElement = document.getElementById("Role5");
          this.roleLabelID = "Role5";
         break;
      case "Role6":
          hrdept = 8; //"Finance"
          LabelElement = document.getElementById("Role6");
          this.roleLabelID = "Role6";
         break;
      case "Role7":
         hrdept = 7; //"Technology"
         LabelElement = document.getElementById("Role7");
         this.roleLabelID = "Role7";
        break;
      case "Role8":
         hrdept = 6; //"Marketing"
         LabelElement = document.getElementById("Role8");
         this.roleLabelID = "Role8";
        break;
      case "Role9":
         hrdept = 3; //"Human Resources"
         LabelElement = document.getElementById("Role9");
         this.roleLabelID = "Role9";
        break;
      case "Role10":
        //  hrdept = 12; /"Word Processing"
         LabelElement = document.getElementById("Role10");
         this.roleLabelID = "Role10";
        break;
     default: 
        break;
    }
    LabelElement.className = "med-font btn btn-outline-secondary active";

    this.pageNumber = 0;
    this.clearLocation();
    this.clearAlpha();
    this.clearCPRNotary();
  }

  clearRole(): void {
    var _element
    _element = document.getElementById(this.roleLabelID);
    _element.className = "med-font btn btn-outline-secondary";

    _element = document.getElementById("Role1");
    _element.className = "med-font btn btn-outline-secondary active";
    this.roleLabelID = "Role1";
  }

  clearAlpha(): void {
    var _element
    _element = document.getElementById(this.alphaLabelID);
    _element.className = "btn btn-outline-secondary";

    _element = document.getElementById("alphaAll");
    _element.className = "btn btn-outline-secondary active";
    this.alphaLabelID = "alphaAll";
  }

  ByAlpha(alpha: string): void {
    var LabelElement;
    LabelElement = document.getElementById(this.alphaLabelID);
    LabelElement.className = "normal-font btn btn-outline-secondary";

    // research how to pull people by first letter of last name
    
    switch (alpha) {
      case "a":
          LabelElement = document.getElementById("alphaA");
          this.alphaLabelID = "alphaA";
         break;
      case "b": 
          LabelElement = document.getElementById("alphaB");
          this.alphaLabelID = "alphaB";
         break;
      case "c":
          LabelElement = document.getElementById("alphaC");
          this.alphaLabelID = "alphaC";
         break;
      case "d":
          LabelElement = document.getElementById("alphaD");
           this.alphaLabelID = "alphaD";
         break;
      case "e":
          LabelElement = document.getElementById("alphaE");
          this.alphaLabelID = "alphaE";
         break;
      case "f":
          LabelElement = document.getElementById("alphaF");
          this.alphaLabelID = "alphaF";
         break;
      case "g":
         LabelElement = document.getElementById("alphaG");
         this.alphaLabelID = "alphaG";
        break;
      case "h":
          LabelElement = document.getElementById("alphaH");
          this.alphaLabelID = "alphaH";
        break;
      case "i":
          LabelElement = document.getElementById("alphaI");
          this.alphaLabelID = "alphaI";
        break;
      case "j":
          LabelElement = document.getElementById("alphaJ");
          this.alphaLabelID = "alphaJ";
         break;
      case "k":
          LabelElement = document.getElementById("alphaK");
          this.alphaLabelID = "alphaK";
         break;
      case "l":
          LabelElement = document.getElementById("alphaL");
          this.alphaLabelID = "alphaL";
        break;
      case "m":
          LabelElement = document.getElementById("alphaM");
          this.alphaLabelID = "alphaM";
          break;
      case "n":
          LabelElement = document.getElementById("alphaN");
          this.alphaLabelID = "alphaN";
         break;
      case "o":
          LabelElement = document.getElementById("alphaO");
          this.alphaLabelID = "alphaO";
        break;
      case "p":
          LabelElement = document.getElementById("alphaP");
          this.alphaLabelID = "alphaP";
        break;
      case "q":
          LabelElement = document.getElementById("alphaQ");
          this.alphaLabelID = "alphaQ";
        break;
      case "r":
          LabelElement = document.getElementById("alphaR");
          this.alphaLabelID = "alphaR";
         break;
      case "s":
          LabelElement = document.getElementById("alphaS");
          this.alphaLabelID = "alphaS";
        break;
      case "t":
          LabelElement = document.getElementById("alphaT");
          this.alphaLabelID = "alphaT";
        break;
      case "u":
          LabelElement = document.getElementById("alphaU");
          this.alphaLabelID = "alphaU";
        break;
      case "v":
          LabelElement = document.getElementById("alphaV");
          this.alphaLabelID = "alphaV";
         break;
      case "w":
          LabelElement = document.getElementById("alphaW");
          this.alphaLabelID = "alphaW";
        break;
      case "x":
          LabelElement = document.getElementById("alphaX");
          this.alphaLabelID = "alphaX";
        break;
      case "y":
          LabelElement = document.getElementById("alphaY");
          this.alphaLabelID = "alphaY";
        break;
      case "z":
          LabelElement = document.getElementById("alphaZ");
          this.alphaLabelID = "alphaZ";
         break;
      default: 
          LabelElement = document.getElementById("alphaAll");
          this.alphaLabelID = "alphaAll";
        break;
    }
    LabelElement.className = "btn btn-outline-secondary normal-font active";

    if (alpha == null) {
      this.activePeople = this.sortPeople;
    }
    else {
      this.activePeople = this.people.filter(p => p.lastname[0].toLowerCase().includes(alpha.toLocaleLowerCase()));
    } 
    this.clearRole();
    this.clearLocation();
  }
}