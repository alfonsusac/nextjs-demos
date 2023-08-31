-- CreateTable
CREATE TABLE "Article" (
    "id" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "ast" JSONB NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_id_key" ON "Article"("id");
