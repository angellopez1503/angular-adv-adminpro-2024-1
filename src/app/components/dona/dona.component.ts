import { Component, OnInit, Input } from '@angular/core';
import { ChartData, ChartEvent, ChartType } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styleUrls: ['./dona.component.css']
})
export class DonaComponent implements OnInit {

  @Input()
  title:string = 'Otro'

  @Input()
  public labels: string[] = [
    'Download Sales',
    'In-Store Sales',
    'Mail-Order Sales',
  ];

  @Input()
  public data:number[]=[350, 450, 100]

  public doughnutChartData!: ChartData<'doughnut'>
  public doughnutChartType: ChartType = 'doughnut';

  constructor() { }

  ngOnInit(): void {

    this.doughnutChartData = {
      labels: this.labels,
      datasets: [
        { data:this.data,
        backgroundColor:['#2D6FE8','#17F04F','#EF2C61'] },

      ],
    };

  }

}
