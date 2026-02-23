-- CreateTable
CREATE TABLE `Video` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `originalUrl` VARCHAR(191) NOT NULL,
    `processedUrl` VARCHAR(191) NULL,
    `thumbnailUrl` VARCHAR(191) NULL,
    `status` ENUM('UPLOADED', 'PROCESSING', 'READY', 'FAILED') NOT NULL DEFAULT 'UPLOADED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Video_userId_idx`(`userId`),
    INDEX `Video_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Video` ADD CONSTRAINT `Video_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
