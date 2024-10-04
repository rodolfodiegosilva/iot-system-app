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
import { Device, DeviceRequest, DeviceStatus } from '../../models/device.model';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CommandDescription, Parameter } from '../../models/command-description.model';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { SimpleUser } from '../../models/user.model';
import { UserService } from '../../services/user-service';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-new-device',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BreadcrumbModule,
    AccordionModule,
    ButtonModule,
    MultiSelectModule,
  ],
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
  commandExpanded: boolean[] = [];
  parameterExpanded: boolean[] = [];

  filteredUsers: SimpleUser[] = [];
  selectedUsers: SimpleUser[] = [];

  statuses = Object.values(DeviceStatus);

  constructor(
    private fb: FormBuilder,
    private deviceService: DeviceService,
    private userService: UserService,
    private router: Router
  ) {
    this.deviceForm = this.fb.group({
      deviceName: ['', Validators.required],
      description: ['', Validators.required],
      industryType: ['', Validators.required],
      manufacturer: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]],
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
    this.searchUsers('');
  }

  get f() {
    return this.deviceForm.controls;
  }

  searchUsers(filter: string) {
    this.userService.searchUsers(filter).subscribe({
      next: (users: SimpleUser[]) => {
        this.filteredUsers = users.map((user) => ({
          username: user.username,
          email: user.email,
          active: true
        }));
      },
      error: (error) => {
        console.error('Erro ao buscar usuários:', error);
      },
      complete: () => {
        console.log('Busca de usuários concluída.');
      },
    });
  }

  addCommand() {
    const commandGroup: CommandDescription = {
      operation: '',
      description: '',
      result: '',
      format: '',
      command: {
        command: '',
        parameters: [{ name: '', description: '' }],
      },
    };
    this.commands.push(commandGroup);
    this.commandExpanded.push(true);
  }

  addParameter(commandIndex: number) {
    this.commands[commandIndex].command.parameters.push({
      name: '',
      description: '',
    });
  }

  deleteCommand(index: number) {
    this.commands.splice(index, 1);
    this.commandExpanded.splice(index, 1);
  }

  deleteParameter(commandIndex: number, paramIndex: number) {
    this.commands[commandIndex].command.parameters.splice(paramIndex, 1);
  }

  cloneDevice(deviceCode: string) {
    const device = this.devices.find((d) => d.deviceCode === deviceCode);

    if (!device) {
      this.errorMessage = 'Device not found';
      return;
    }

    this.deviceForm.patchValue({
      deviceName: `${device.deviceName} - Clone`,
      description: device.description,
      industryType: device.industryType,
      manufacturer: device.manufacturer,
      url: device.url,
      deviceStatus: device.deviceStatus,
    });

    this.commands = this.cloneCommands(device.commands);
  }

  cloneCommands(commands: CommandDescription[]): CommandDescription[] {
    return commands.map((cmd: CommandDescription) => ({
      operation: cmd.operation,
      description: cmd.description,
      result: cmd.result,
      format: cmd.format,
      command: {
        command: cmd.command.command,
        parameters: cmd.command.parameters.map((param: Parameter) => ({
          name: param.name,
          description: param.description,
        })),
      },
    }));
  }

  isCommandValid(index: number): boolean {
    const command = this.commands[index];
    return (
      !!command.operation &&
      !!command.description &&
      !!command.result &&
      !!command.format &&
      !!command.command.command
    );
  }

  isCommandIncomplete(index: number): boolean {
    const command = this.commands[index];
    return (
      !command.operation ||
      !command.description ||
      !command.result ||
      !command.format ||
      !command.command.command
    );
  }

  isAllCommandsValid(): boolean {
    if (this.commands.length === 0) {
      return false;
    }

    for (let i = 0; i < this.commands.length; i++) {
      if (!this.isCommandValid(i)) {
        return false;
      }

      for (let param of this.commands[i].command.parameters) {
        if (!param.name || !param.description) {
          return false;
        }
      }
    }

    return true;
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

    if (this.deviceForm.invalid || !this.isAllCommandsValid()) {
      return;
    }
    const selectedUsernames = this.selectedUsers.map((user) => user.username);

    const deviceData: DeviceRequest = {
      ...this.deviceForm.value,
      commands: this.commands,
      usernames: selectedUsernames,
    };

    this.deviceService.createDevice(deviceData).subscribe({
      next: (response: Device) => {
        const deviceCode = response.deviceCode;
        this.successMessage = 'Device created successfully';
        setTimeout(() => {
          this.router.navigate(['/device', deviceCode]);
        }, 1000);
      },
      error: (error: any) => {
        this.errorMessage = 'An error occurred while creating the device.';
        console.error('Erro ao criar o dispositivo:', error);
      },
      complete: () => {
        console.log('Criação do dispositivo concluída.');
      },
    });
  }

  toggleCommandExpansion(index: number, isExpanded: boolean): void {
    this.commandExpanded[index] = isExpanded;
    this.isCommandIncomplete(index);
  }

  isParameterIncomplete(commandIndex: number, paramIndex: number): boolean {
    const param = this.commands[commandIndex].command.parameters[paramIndex];
    return !param.name || !param.description;
  }

  toggleParameterExpansion(index: number, isExpanded: boolean): void {
    this.parameterExpanded[index] = isExpanded;
  }
}
