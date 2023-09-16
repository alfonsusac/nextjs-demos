-- CreateTable
CREATE TABLE "Links" (
    "url" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "faviconURL" TEXT,
    "thumbnailURL" TEXT,

    CONSTRAINT "Links_pkey" PRIMARY KEY ("url")
);

-- CreateIndex
CREATE UNIQUE INDEX "Links_url_key" ON "Links"("url");
