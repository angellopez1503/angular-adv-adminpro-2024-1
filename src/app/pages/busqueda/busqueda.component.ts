import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusquedasService } from '../../services/busquedas.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Medico } from 'src/app/models/medico.model';
import { Hospital } from 'src/app/models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css'],
})
export class BusquedaComponent implements OnInit {
  public usuarios: Usuario[] = [];
  public medicos: Medico[] = [];
  public hospitales: Hospital[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private busquedasService: BusquedasService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ termino }) =>
      this.busquedaGlobal(termino)
    );
  }

  busquedaGlobal(termino: string) {
    this.busquedasService.busquedaGlobal(termino).subscribe((res: any) => {
      console.log(res);
      this.usuarios = res.usuarios;
      this.medicos = res.medicos;
      this.hospitales = res.hospitales;
    });
  }

  abrirMedico(medico:Medico){

    
  }
}
