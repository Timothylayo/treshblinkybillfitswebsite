/*
  Warnings:

  - You are about to drop the `OrderDetail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "OrderDetail_orderId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "OrderDetail";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" TEXT NOT NULL,
    "designId" INTEGER,
    "qty" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL NOT NULL DEFAULT 0,
    "itemTotal" DECIMAL NOT NULL DEFAULT 0,
    "event" TEXT,
    "notes" TEXT,
    "chest" REAL,
    "waist" REAL,
    "hip" REAL,
    "shoulder" REAL,
    "sleeveLength" REAL,
    "bodyLength" REAL,
    "trouserLength" REAL,
    "thigh" REAL,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "deliveryMode" TEXT NOT NULL DEFAULT 'pickup',
    "deliveryFee" DECIMAL NOT NULL DEFAULT 0,
    "grandTotal" DECIMAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "id", "status", "updatedAt", "userId") SELECT "createdAt", "id", "status", "updatedAt", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
