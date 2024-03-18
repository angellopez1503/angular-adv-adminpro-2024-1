import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from 'src/app/models/hospital.model';
import { Subscription, delay } from 'rxjs';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from 'src/app/models/medico.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css'],
})
export class MedicoComponent implements OnInit {
  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado?: Hospital;

  public medicoSeleccionado?: Medico;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    this.cargarHospitales();

     this.medicoForm
      .get('hospital')
      ?.valueChanges.subscribe((hospitalId) => {
        console.log('tick');
        this.hospitalSeleccionado = this.hospitales.find(
          (h) => h._id === hospitalId
        );
      });

    this.activatedRoute.params.subscribe(({ id }) => {
      this.cargarMedico(id);
      console.log('tick');
    });
  }

  cargarMedico(id: string) {
    if (id === 'nuevo') {
      return;
    }

    this.medicoService.obtenerMedicoPorId(id)
    .pipe(
      delay(100)
    )
    .subscribe(
      (medico) => {
        if (!medico) {
          this.router.navigateByUrl(`/dashboard/medicos`);
          return;
        }

        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({
          nombre: medico.nombre,
          hospital: medico.hospital?._id,
        });
      },
      (err) => {
        this.router.navigateByUrl(`/dashboard/medicos`);
        return;
      }
    );
  }



  cargarHospitales() {
    this.hospitalService
      .cargarHospitales()
      .subscribe((hospitales: Hospital[]) => {
        this.hospitales = hospitales;
      });
  }

  guardarMedico() {
    const { nombre } = this.medicoForm.value;
    if (this.medicoSeleccionado) {
      //actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id,
      };
      this.medicoService.actualizarMedico(data).subscribe((res) => {
        console.log(res);
        Swal.fire(
          'Actualizado',
          `${nombre} actualizado correctamente`,
          'success'
        );
      });
    } else {
      //crear

      this.medicoService
        .crearMedico(this.medicoForm.value)
        .subscribe((res: any) => {
          console.log(res);
          Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${res.medico._id}`);
        });
    }
  }
}
