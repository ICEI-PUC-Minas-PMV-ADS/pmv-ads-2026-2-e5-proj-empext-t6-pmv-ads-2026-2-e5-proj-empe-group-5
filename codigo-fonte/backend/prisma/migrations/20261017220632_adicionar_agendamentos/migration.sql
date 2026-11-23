-- CreateTable
CREATE TABLE "agendamentos" (
    "id" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "servico" TEXT NOT NULL,
    "tecnico" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agendamentos_pkey" PRIMARY KEY ("id")
);
