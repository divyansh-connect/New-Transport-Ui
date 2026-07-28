-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `customId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `lastName` VARCHAR(100) NULL,
    `mobileNo` VARCHAR(20) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `carPlateNumber` VARCHAR(30) NULL,
    `email` VARCHAR(150) NULL,
    `role` ENUM('driver', 'workshop', 'oil', 'visitor', 'admin') NOT NULL DEFAULT 'visitor',
    `status` ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
    `registrationDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `subscriptionDuration` VARCHAR(50) NOT NULL,
    `amountPaid` VARCHAR(20) NOT NULL,
    `paymentStatus` ENUM('Paid', 'Unpaid', 'Trial') NOT NULL DEFAULT 'Unpaid',
    `paymentMethod` VARCHAR(50) NOT NULL DEFAULT 'None',
    `latitude` DECIMAL(10, 8) NULL,
    `longitude` DECIMAL(11, 8) NULL,
    `trackLocation` BOOLEAN NOT NULL DEFAULT true,
    `rejectionReason` TEXT NULL,
    `licenseName` VARCHAR(255) NULL,
    `licenseStatus` VARCHAR(50) NOT NULL DEFAULT 'Pending Verification',
    `licenseUrl` TEXT NULL,
    `insuranceName` VARCHAR(255) NULL,
    `insuranceStatus` VARCHAR(50) NOT NULL DEFAULT 'Pending Verification',
    `insuranceUrl` TEXT NULL,
    `backgroundCheckName` VARCHAR(255) NULL,
    `backgroundCheckStatus` VARCHAR(50) NOT NULL DEFAULT 'Pending Verification',
    `backgroundCheckUrl` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_customId_key`(`customId`),
    UNIQUE INDEX `User_mobileNo_key`(`mobileNo`),
    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_role_idx`(`role`),
    INDEX `User_status_idx`(`status`),
    INDEX `User_mobileNo_idx`(`mobileNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `customId` VARCHAR(191) NOT NULL,
    `driverId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `amount` VARCHAR(20) NOT NULL,
    `gateway` VARCHAR(50) NOT NULL,
    `status` VARCHAR(30) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Payment_customId_key`(`customId`),
    INDEX `Payment_driverId_idx`(`driverId`),
    INDEX `Payment_customId_idx`(`customId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `customId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Notification_customId_key`(`customId`),
    INDEX `Notification_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
