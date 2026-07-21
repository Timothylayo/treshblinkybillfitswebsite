-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" TEXT NOT NULL,
    "designId" INTEGER,
    "event" TEXT,
    "neededBy" DATETIME,
    "qty" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "deliveryMode" TEXT NOT NULL DEFAULT 'pickup',
    "chest" REAL,
    "waist" REAL,
    "hip" REAL,
    "shoulder" REAL,
    "sleeveLength" REAL,
    "bodyLength" REAL,
    "trouserLength" REAL,
    "thigh" REAL,
    "fabricImageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OrderDetail_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderDetail_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_OrderDetail" ("bodyLength", "chest", "createdAt", "designId", "event", "fabricImageUrl", "hip", "id", "neededBy", "notes", "orderId", "qty", "shoulder", "sleeveLength", "thigh", "trouserLength", "updatedAt", "waist") SELECT "bodyLength", "chest", "createdAt", "designId", "event", "fabricImageUrl", "hip", "id", "neededBy", "notes", "orderId", "qty", "shoulder", "sleeveLength", "thigh", "trouserLength", "updatedAt", "waist" FROM "OrderDetail";
DROP TABLE "OrderDetail";
ALTER TABLE "new_OrderDetail" RENAME TO "OrderDetail";
CREATE UNIQUE INDEX "OrderDetail_orderId_key" ON "OrderDetail"("orderId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
