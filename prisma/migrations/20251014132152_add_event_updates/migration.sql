-- CreateTable
CREATE TABLE "public"."EventUpdate" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventUpdate_eventId_idx" ON "public"."EventUpdate"("eventId");

-- CreateIndex
CREATE INDEX "EventUpdate_senderId_idx" ON "public"."EventUpdate"("senderId");

-- AddForeignKey
ALTER TABLE "public"."EventUpdate" ADD CONSTRAINT "EventUpdate_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventUpdate" ADD CONSTRAINT "EventUpdate_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
