import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DeviceService } from '../../services/device-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Device } from '../../models/device.model';
import { DeviceStatus } from '../../models/device-status.enum';

@Component({
  selector: 'app-new-device',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './new-device.component.html',
  styleUrls: ['./new-device.component.css']
})
export class NewDeviceComponent implements OnInit {
  deviceForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  industryTypes: string[] = [];
  devices: Device[] = [];
  selectedDeviceCode: string = '';

  statuses = Object.values(DeviceStatus); // Utilizando o enum

  constructor(
    private fb: FormBuilder,
    private deviceService: DeviceService,
    private router: Router
  ) {
    this.deviceForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      status: [DeviceStatus.ON, Validators.required],
      industryType: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.deviceService.getIndustryTypes().subscribe(types => {
      this.industryTypes = types;
    });

    this.deviceService.getAllDevices().subscribe(devices => {
      this.devices = devices;
    });
  }

  get f() {
    return this.deviceForm.controls;
  }

  createDevice() {
    this.successMessage = '';
    this.errorMessage = '';
    if (this.deviceForm.invalid) {
      return;
    }

    this.deviceService.createDevice(this.deviceForm.value).subscribe(
      (response) => {
        const deviceCode = response.deviceCode;
        this.successMessage = 'Device created successfully';
        setTimeout(() => {
          this.router.navigate(['/device', deviceCode]);
        }, 1000); // Redireciona após 1 segundo
      },
      (error) => {
        this.errorMessage = 'An error occurred while creating the device.';
      }
    );
  }

  cloneDevice(deviceCode: string) {
    const device = this.devices.find(d => d.deviceCode === deviceCode);
    if (device) {
      this.deviceForm.patchValue({
        name: device.name,
        description: device.description,
        status: device.status,
        industryType: device.industryType
      });
    }
  }
}
