import { Controller, Get, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { CheckAdminGuard } from "./guards/checkadmin.guard";


@Controller("api/admin")
export class AdminController {
    constructor(private readonly adminService: AdminService) {}


    @Get("/count-status-video")
    // @UseGuards(CheckAdminGuard)
    async countStatusVideo(){
        return this.adminService.countStatusVideo();
    }

    @Get("/all-video")
    // @UseGuards(CheckAdminGuard)
    async getAllVideo(){
        return this.adminService.getAllVideo();
    }
    
}