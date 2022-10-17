/*
  Warnings:

  - You are about to drop the `chatmessages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `supportrequests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `chatmessages` DROP FOREIGN KEY `ChatMessages_supportRequestId_fkey`;

-- DropForeignKey
ALTER TABLE `chatmessages` DROP FOREIGN KEY `ChatMessages_userId_fkey`;

-- DropForeignKey
ALTER TABLE `supportrequests` DROP FOREIGN KEY `SupportRequests_userId_fkey`;

-- DropTable
DROP TABLE `chatmessages`;

-- DropTable
DROP TABLE `supportrequests`;
