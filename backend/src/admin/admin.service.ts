import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class AdminService{
    constructor(private readonly prisma: PrismaService) {}


    async countStatusVideo(){
        try {
           const countVideoUploaded = await this.prisma.video.count({
            where:{status:"UPLOADED"}
           })

            const countVideoProcessing = await this.prisma.video.count({
            where:{status:"PROCESSING"}
           })

            const countVideoReady = await this.prisma.video.count({
            where:{status:"READY"}
           })

            const countVideoFailed = await this.prisma.video.count({
            where:{status:"FAILED"}
           })
           return {
            uploaded: countVideoUploaded,
            processing: countVideoProcessing,
            ready: countVideoReady,
            failed: countVideoFailed
           }
        } catch (error) {
            throw new InternalServerErrorException("something went wrong")
        }
    }


    async getAllVideo(){
        try {
            const allVideo = await this.prisma.video.findMany();
            return allVideo;
        } catch (error) {
            throw new InternalServerErrorException("something went wrong")
        }
    }
}