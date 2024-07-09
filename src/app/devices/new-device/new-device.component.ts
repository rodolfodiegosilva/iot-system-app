import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { DeviceService } from '../../services/device-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Device } from '../../models/device.model';
import { DeviceStatus } from '../../models/device-status.enum';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CommandDescription } from '../../models/command-description.model';
import { Command } from '../../models/command.model';
import { Parameter } from '../../models/parameter.model';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-new-device',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, BreadcrumbModule, AccordionModule, ButtonModule],
  templateUrl: './new-device.component.html',
  styleUrls: ['./new-device.component.css'],
})
export class NewDeviceComponent implements OnInit {
  deviceForm: FormGroup;
  breadcrumbItems: any[];
  step: number = 1;
  successMessage: string = '';
  errorMessage: string = '';
  industryTypes: string[] = [];
  devices: Device[] = [];
  selectedDeviceCode: string = '';
  commands: CommandDescription[] = [];

  statuses = Object.values(DeviceStatus); // Utilizando o enum

  constructor(
    private fb: FormBuilder,
    private deviceService: DeviceService,
    private router: Router
  ) {
    this.deviceForm = this.fb.group({
      deviceName: ['', Validators.required],
      description: ['', Validators.required],
      industryType: ['', Validators.required],
      manufacturer: ['', Validators.required],
      url: ['', Validators.required],
      deviceStatus: [DeviceStatus.ON, Validators.required],
    });

    this.breadcrumbItems = [
      { label: 'Device Details', command: () => this.setStep(1) },
      { label: 'Commands', command: () => this.setStep(2) },
      { label: 'Review & Submit', command: () => this.setStep(3) },
    ];
  }

  ngOnInit() {
    this.deviceService.getIndustryTypes().subscribe((types) => {
      this.industryTypes = types;
    });

    this.deviceService.getAllDevices().subscribe((devices) => {
      this.devices = devices;
    });
  }

  get f() {
    return this.deviceForm.controls;
  }

  addCommand() {
    const commandGroup: CommandDescription = {
      id: 0,
      operation: '',
      description: '',
      result: '',
      format: '',
      command: {
        id: 0,
        command: '',
        parameters: [{ id: 0, name: '', description: '' }]
      }
    };
    this.commands.push(commandGroup);
  }

  addParameter(commandIndex: number) {
    this.commands[commandIndex].command.parameters.push({ id: 0, name: '', description: '' });
  }

  removeCommand(index: number) {
    this.commands.splice(index, 1);
  }

  removeParameter(commandIndex: number, paramIndex: number) {
    this.commands[commandIndex].command.parameters.splice(paramIndex, 1);
  }

  setStep(step: number) {
    this.step = step;
  }

  nextStep() {
    if (this.step < 3) {
      this.step++;
    }
  }

  previousStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  createDevice() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.deviceForm.invalid) {
      return;
    }

    const deviceData: Device = {
      id: 0,
      deviceCode: '',
      ...this.deviceForm.value,
      commands: this.commands,
      user: null,
      createdAt: new Date().toISOString()
    };

    this.deviceService.createDevice(deviceData).subscribe(
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
        deviceName: device.deviceName,
        description: device.description,
        industryType: device.industryType,
        manufacturer: device.manufacturer,
        url: device.url,
        deviceStatus: device.deviceStatus
      });
  
      // Clonar comandos
      this.commands = device.commands.map((cmd: CommandDescription) => ({
        ...cmd,
        command: {
          ...cmd.command,
          parameters: cmd.command.parameters.map((param: Parameter) => ({ ...param }))
        }
      }));
    }
  }

  deleteCommand(index: number) {
    this.commands.splice(index, 1);
  }

  deleteParameter(commandIndex: number, paramIndex: number) {
    this.commands[commandIndex].command.parameters.splice(paramIndex, 1);
  }
}
