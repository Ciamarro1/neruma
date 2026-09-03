import asyncio
import signal
import sys
from app.worker.queue import ValkeyJobQueue
from app.pipelines.orchestrator import ProductIntelligenceOrchestrator

running = True

def handle_exit(sig, frame):
    global running
    print(f"\n[AI Worker] Sinal de encerramento ({sig}) recebido. Finalizando tarefas...")
    running = False

async def main_worker_loop():
    global running
    print("=============================================================")
    print("   NERUMA AI PRODUCT INTELLIGENCE WORKER INICIADO (VALKEY)   ")
    print("=============================================================")

    queue = ValkeyJobQueue()
    orchestrator = ProductIntelligenceOrchestrator()

    while running:
        try:
            # Aguarda e puxa job de forma atômica da fila Valkey
            job = await queue.pop_job(timeout_seconds=3)
            if not job:
                await asyncio.sleep(1)
                continue

            print(f"[AI Worker] Novo job detectado: {job.id} | Tipo: {job.type} | Produto: {job.product_id}")

            try:
                # Executa o pipeline de inteligência
                result = await orchestrator.process_job(job)
                print(f"[AI Worker] Job {job.id} processado com sucesso! Confiança: {result['quality_gate']['confidence_score']} | Roteamento: {result['quality_gate']['routing']}")
                await queue.mark_completed(job)
            except Exception as process_err:
                print(f"[AI Worker] Erro ao executar job {job.id}: {process_err}")
                await queue.handle_failure(job, str(process_err))

        except asyncio.CancelledError:
            break
        except Exception as queue_err:
            print(f"[AI Worker] Erro na conexão com a fila Valkey: {queue_err}")
            await asyncio.sleep(3)

    print("[AI Worker] Processo encerrado com sucesso.")

if __name__ == "__main__":
    signal.signal(signal.SIGINT, handle_exit)
    signal.signal(signal.SIGTERM, handle_exit)
    asyncio.run(main_worker_loop())
