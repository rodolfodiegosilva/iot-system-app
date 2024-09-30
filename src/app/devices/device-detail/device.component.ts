import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Device } from '../../models/device.model';
import { DeviceService } from '../../services/device-service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { DropdownModule } from 'primeng/dropdown';
import { DeviceMonitoringComponent } from '../device-monitoring/device-monitoring.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { SimpleUser } from '../../models/user.model';
import { UserService } from '../../services/user-service';
import { Parameter } from '../../models/parameter.model';
import { CommandDescription } from '../../models/command-description.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbModule,
    CardModule,
    PanelModule,
    ButtonModule,
    AccordionModule,
    DropdownModule,
    ReactiveFormsModule,
    DeviceMonitoringComponent,
    MultiSelectModule,
  ],
})
export class DeviceComponent implements OnInit {
  deviceForm: FormGroup;
  device: Device | undefined;
  editMode = false;
  errorMessage: string | undefined;
  breadcrumbItems: any[] = [];
  industryTypes: any[] = [];
  filteredUsers: SimpleUser[] = [];
  selectedUsers: SimpleUser[] = [];
  filterText: string = '';
  dropdownOpen = false;
  loggedUser: any;
  canEdit: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private deviceService: DeviceService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.deviceForm = this.fb.group({
      deviceName: ['', Validators.required],
      description: ['', Validators.required],
      industryType: ['', Validators.required],
      manufacturer: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]],
      deviceStatus: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.fetchUserData().subscribe({
      next: (data: any) => {
        this.loggedUser = data;
      },
      error: () => {
        this.errorMessage = 'User not found';
      },
    });

    const deviceCode = this.route.snapshot.paramMap.get('deviceCode');
    if (deviceCode) {
      this.deviceService.getDeviceByCode(deviceCode).subscribe({
        next: (data: Device) => {
          this.device = data;
          this.selectedUsers = data.users
            .filter((user) => user.email !== data.createdBy.email)
            .map((user) => ({
              username: user.username,
              email: user.email,
              active: user.enabled,
            }));
          this.isUserDeviceOwner();
          this.populateForm(data);
          this.setBreadcrumbItems();
          this.searchUsers();
        },
        error: () => {
          this.errorMessage = 'Device not found';
        },
      });
    }
    this.deviceService.getIndustryTypes().subscribe((types) => {
      this.industryTypes = types.map((type) => ({ label: type, value: type }));
    });
  }

  isUserDeviceOwner() {
    this.canEdit =
      this.device &&
      this.loggedUser &&
      this.device.createdBy.email === this.loggedUser.email;
  }

  searchUsers() {
    this.userService.searchUsers(this.filterText).subscribe({
      next: (users: SimpleUser[]) => {
        this.filteredUsers = users.filter(
          (user) =>
            !this.selectedUsers.some(
              (selectedUser) => selectedUser.email === user.email
            )
        );
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  onUserSelect(event: any) {
    const selectedUsers: SimpleUser[] = Array.isArray(event.value)
      ? event.value
      : [event.value];
    selectedUsers.forEach((selectedUser: SimpleUser) => {
      if (
        selectedUser &&
        !this.selectedUsers.some((user) => user.email === selectedUser.email)
      ) {
        this.selectedUsers.push(selectedUser);
        this.filteredUsers = this.filteredUsers.filter(
          (user) => user.email !== selectedUser.email
        );
      }
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectUser(user: SimpleUser) {
    if (
      !this.selectedUsers.some(
        (selectedUser) => selectedUser.email === user.email
      )
    ) {
      this.selectedUsers.push(user);
      this.filteredUsers = this.filteredUsers.filter(
        (filteredUser) => filteredUser.email !== user.email
      );
    }
    this.dropdownOpen = false;
  }

  removeUser(user: SimpleUser) {
    this.selectedUsers = this.selectedUsers.filter(
      (selectedUser) => selectedUser.email !== user.email
    );
    this.filteredUsers.push(user);
  }

  get f() {
    return this.deviceForm.controls;
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  updateDevice(): void {
    if (this.device && this.device.deviceCode) {
      const updatedDevice = {
        deviceName: this.deviceForm.value.deviceName,
        description: this.deviceForm.value.description,
        industryType: this.deviceForm.value.industryType,
        manufacturer: this.deviceForm.value.manufacturer,
        deviceStatus: this.deviceForm.value.deviceStatus,
        url: this.deviceForm.value.url,
        commands: this.device.commands.map((command) => ({
          operation: command.operation,
          description: command.description,
          result: command.result,
          format: command.format,
          command: {
            command: command.command.command,
            parameters: command.command.parameters.map((param) => ({
              name: param.name,
              description: param.description,
            })),
          },
        })),
        usernames: this.selectedUsers.map((user) => user.username),
      };

      this.deviceService
        .updateDevice(this.device.deviceCode, updatedDevice)
        .subscribe({
          next: (updatedDeviceResponse) => {
            this.device = updatedDeviceResponse;
            this.editMode = false;
            this.populateForm(updatedDeviceResponse);
          },
          error: () => {
            this.errorMessage = 'Failed to update device';
          },
        });
    }
  }

  setBreadcrumbItems(): void {
    this.breadcrumbItems = [
      { label: 'Devices', routerLink: ['/devices'] },
      { label: this.device?.deviceName || 'Device Detail', disabled: true },
    ];
  }

  populateForm(device: Device): void {
    this.deviceForm.patchValue({
      deviceName: device.deviceName,
      description: device.description,
      deviceStatus: device.deviceStatus,
      industryType: device.industryType,
      manufacturer: device.manufacturer,
      url: device.url,
    });
  }

  addParameter(commandIndex: number): void {
    const newParameter: Parameter = { name: '', description: '' };
    this.device?.commands[commandIndex].command.parameters.push(newParameter);
  }

  removeParameter(commandIndex: number, paramIndex: number): void {
    this.device?.commands[commandIndex].command.parameters.splice(
      paramIndex,
      1
    );
  }

  addCommand(): void {
    const newCommand: CommandDescription = {
      operation: '',
      description: '',
      result: '',
      format: '',
      command: {
        command: '',
        parameters: [{ name: '', description: '' }],
      },
    };
    this.device?.commands.push(newCommand);
  }

  removeCommand(commandIndex: number): void {
    if (this.device?.commands) {
      this.device.commands.splice(commandIndex, 1);
    }
  }
}
