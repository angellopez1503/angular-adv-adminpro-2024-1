import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styleUrls: ['./grafica1.component.css']
})
export class Grafica1Component implements OnInit {

labels1 : string[] = [
  'Download Sales',
  'In-Store Sales',
  'Mail-Order Sales',
];
labels2 : string[] = [
  'Download Sales2',
  'In-Store Sales2',
  'Mail-Order Sales2',
];
labels3 : string[] = [
  'Download Sales3',
  'In-Store Sales3',
  'Mail-Order Sales3',
];

data1= [350, 450, 100]
data2= [500, 200, 300]
data3= [200, 400, 400]

  constructor() { }

  ngOnInit(): void {
  }



}
