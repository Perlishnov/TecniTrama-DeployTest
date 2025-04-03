export function formatDate(date: Date | null): string {
    if (!date) return "Seleccionar";
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}
