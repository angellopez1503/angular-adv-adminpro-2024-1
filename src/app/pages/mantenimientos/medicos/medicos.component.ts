import { Component, OnDestroy, OnInit } from '@angular/core';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from 'src/app/models/medico.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription, delay } from 'rxjs';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css'],
})
export class MedicosComponent implements OnInit, OnDestroy {
  public medicos: Medico[] = [];
  public cargando: boolean = false;
  private imgSubs!: Subscription;

  constructor(
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService
  ) {}
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(250))
      .subscribe(() => this.cargarMedicos());
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos().subscribe((medicos) => {
      this.cargando = false;
      this.medicos = medicos;
    });
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }

  buscar(termino: string) {
    console.log(termino);
    this.cargando = true;
    if (termino.length === 0) {
      this.cargarMedicos();
      this.cargando = false;
      return;
    }

    this.busquedasService.buscar('medicos', termino).subscribe((res) => {
      this.medicos = res as Medico[];
      this.cargando = false;
    });
  }

  borrarMedico(medico: Medico) {
    Swal.fire({
      title: 'Borrar Medico?',
      text: `Esta a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo',
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.borrarMedico(medico._id!).subscribe((res) => {
          Swal.fire(
            'Borrado',
            `${medico.nombre} fue eliminado correctamente`,
            'success'
          );
          this.cargarMedicos();
        });
      }
    });
  }
}
