import { Component, OnDestroy, OnInit } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from 'src/app/models/hospital.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription, delay } from 'rxjs';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css'],
})
export class HospitalesComponent implements OnInit, OnDestroy {
  public hospitales: Hospital[] = [];
  public cargando: boolean = false;
  private imgSubs!: Subscription;

  constructor(
    private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService
  ) {}

  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(250))
      .subscribe((res) => this.cargarHospitales());
  }

  ngOnDestroy(): void {
     this.imgSubs.unsubscribe()
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales().subscribe((hospitales) => {
      this.cargando = false;
      this.hospitales = hospitales;
    });
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService
      .actualizarHospital(hospital._id!, hospital.nombre)
      .subscribe((res) => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
      });
  }

  eliminarHospital(hospital: Hospital) {
    Swal.fire({
      title: 'Borrar Hospital?',
      text: `Esta a punto de borrar a ${hospital.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalService.borrarHospital(hospital._id!).subscribe((res) => {
          Swal.fire(
            'Borrado',
            `${hospital.nombre} fue eliminado correctamente`,
            'success'
          );
          this.cargarHospitales();
        });
      }
    });
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear hospital',
      input: 'text',
      inputLabel: 'Ingrese el nombre del nuevo hospital',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
    });

    if (value!.trim().length > 0) {
      this.hospitalService.crearHospital(value!).subscribe((res: any) => {
        this.cargarHospitales();
      });
    }
  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal(
      'hospitales',
      hospital._id,
      hospital.img
    );
  }

  buscar(termino: string) {
    this.hospitales = [];
    this.cargando = true;
    if (termino.length === 0) {
      this.cargarHospitales();
      this.cargando = false;
      return;
    }

    this.busquedasService.buscar('hospitales', termino).subscribe((res) => {
      this.hospitales = res as Hospital[];
      this.cargando = false;
    });
  }
}
