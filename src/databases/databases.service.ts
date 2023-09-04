import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User } from 'src/decorator/customize';
import { Permission, PermissionDocument } from 'src/permissions/schemas/permission.schemas';
import { Role, RoleDocument } from 'src/roles/schemas/role.schemas';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DatabasesService implements OnModuleInit {
    constructor(
        @InjectModel(User.name) private UserModel: SoftDeleteModel<UserDocument>,
        @InjectModel(Permission.name) private PermissionModel: SoftDeleteModel<PermissionDocument>,
        @InjectModel(Role.name) private RoleModel: SoftDeleteModel<RoleDocument>,
        private configService: ConfigService,
        private userService: UsersService
        ) {}
    onModuleInit() {
        console.log(`The module has been initialized.`);
      }
}
