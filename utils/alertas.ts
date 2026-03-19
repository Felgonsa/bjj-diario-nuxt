import Swal from 'sweetalert2'

// Configuração base e invisível do Toast
const ToastBase = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: 'mt-16' // Nosso recuo do header minimalista
  }
})

// Exportamos um objeto com os métodos rápidos de Toast
export const alertaToast = {
  sucesso: (mensagem: string) => {
    ToastBase.fire({ icon: 'success', title: mensagem })
  },
  erro: (titulo: string, textoDetalhado?: string) => {
    ToastBase.fire({ icon: 'error', title: titulo, text: textoDetalhado })
  },
  aviso: (titulo: string, textoDetalhado?: string) => {
    ToastBase.fire({ icon: 'warning', title: titulo, text: textoDetalhado })
  }
}

// Exportamos uma função assíncrona limpa para Confirmações Críticas
export const alertaConfirmar = async (titulo: string, texto: string, textoBotaoAfirmativo: string = 'Sim') => {
  const resultado = await Swal.fire({
    title: titulo,
    text: texto,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444', // Vermelho (perigo)
    cancelButtonColor: '#3b82f6',  // Azul (seguro)
    confirmButtonText: textoBotaoAfirmativo,
    cancelButtonText: 'Cancelar',
    customClass: {
      popup: 'rounded-xl'
    }
  })

  // Retorna apenas um boolean (true ou false) para a tela que chamou
  return resultado.isConfirmed
}