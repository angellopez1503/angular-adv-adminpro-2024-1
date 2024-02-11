import { AfterViewInit, Component, OnInit } from '@angular/core';

declare function customInitFunctions():void

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,AfterViewInit {
ngAfterViewInit(): void {

  setTimeout(()=>{
    customInitFunctions()
  },50)

}

  title = 'adminpro';

  ngOnInit(): void {

    // setTimeout(()=>{
    //   customInitFunctions()
    // },50)

  }
}
