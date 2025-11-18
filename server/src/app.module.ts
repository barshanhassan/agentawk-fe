import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './cache/cache.module';
import { UserModule } from './user/user.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { RoleModule } from './role/role.module';
import { TennantModule } from './tennant/tennant.module';

@Module({
  imports: [AuthModule, WorkspaceModule, TennantModule, RoleModule, UserModule, CacheModule, DatabaseModule, SessionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
