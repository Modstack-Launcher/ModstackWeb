import { useEffect } from "react";
import InfoPageShell, { InfoSection } from "../components/InfoPageShell";
import { useLanguage } from "../i18n";

const content = {
  en: {
    pageTitle: "Support - Modstack",
    title: "Modstack Support",
    subtitle: "Quick checks for common installation, account, game-launch, and mod compatibility problems.",
    sections: [
      { title: "The installer does not open", items: ["Confirm that the package matches your operating system.", "Download it again from the official homepage if the file is incomplete.", "Check your system security history before overriding any warning.", "Make sure your user account can install or execute applications."] },
      { title: "Sign-in is not completing", paragraphs: ["Confirm that your browser can open the provider’s login page and that the system clock is correct. Complete authentication only on the official Microsoft, Google, or Discord domain shown by the provider.", "If the login window was closed or interrupted, return to Modstack and begin the sign-in flow again rather than sharing a code or password with someone else."] },
      { title: "Minecraft closes during startup", ordered: true, items: ["Try launching the instance without recently added mods.", "Verify that the game version, mod loader, and every mod are compatible.", "Restore default memory settings if you changed them recently.", "Test a new, unmodified instance to separate a game issue from a mod issue."], paragraphs: ["Keep the crash report or latest log when requesting help. Remove access tokens, email addresses, and personal file paths before posting logs publicly."] },
      { title: "A modpack or world is not working", paragraphs: ["Use the exact Minecraft and loader versions requested by the modpack. Do not remove content mods from an existing world without making a backup first. Problems that occur only in one third-party modpack may need to be reported to that modpack’s author."] },
      { title: "Contact the community", paragraphs: ["If the checks above do not solve the issue, describe what you expected, what happened, your operating system, and the affected Minecraft version."] },
    ],
    discord: "Ask on Discord",
    email: "Email support",
  },
  es: {
    pageTitle: "Soporte - Modstack",
    title: "Soporte de Modstack",
    subtitle: "Comprobaciones rápidas para problemas comunes de instalación, cuentas, inicio del juego y compatibilidad de mods.",
    sections: [
      { title: "El instalador no abre", items: ["Confirma que el paquete corresponda a tu sistema operativo.", "Descárgalo nuevamente desde la página oficial si el archivo está incompleto.", "Revisa el historial de seguridad del sistema antes de ignorar una advertencia.", "Comprueba que tu cuenta de usuario pueda instalar o ejecutar aplicaciones."] },
      { title: "El inicio de sesión no termina", paragraphs: ["Confirma que el navegador pueda abrir la página de inicio del proveedor y que la hora del sistema sea correcta. Completa la autenticación únicamente en el dominio oficial de Microsoft, Google o Discord mostrado por el proveedor.", "Si cerraste o interrumpiste la ventana, vuelve a Modstack e inicia el proceso otra vez en lugar de compartir un código o contraseña con otra persona."] },
      { title: "Minecraft se cierra durante el inicio", ordered: true, items: ["Intenta iniciar la instancia sin los mods añadidos recientemente.", "Comprueba que la versión del juego, el mod loader y todos los mods sean compatibles.", "Restaura la configuración de memoria predeterminada si la cambiaste recientemente.", "Prueba una instancia nueva y sin modificaciones para separar un problema del juego de uno de mods."], paragraphs: ["Conserva el informe de fallo o el registro más reciente cuando solicites ayuda. Elimina tokens de acceso, correos y rutas personales antes de publicar registros."] },
      { title: "Un modpack o mundo no funciona", paragraphs: ["Usa exactamente las versiones de Minecraft y del loader que requiere el modpack. No elimines mods de contenido de un mundo existente sin crear antes una copia de seguridad. Los problemas exclusivos de un modpack de terceros pueden necesitar ser reportados a su autor."] },
      { title: "Contacta a la comunidad", paragraphs: ["Si estas comprobaciones no resuelven el problema, describe qué esperabas, qué ocurrió, tu sistema operativo y la versión de Minecraft afectada."] },
    ],
    discord: "Preguntar en Discord",
    email: "Soporte por correo",
  },
  pt: {
    pageTitle: "Suporte - Modstack",
    title: "Suporte do Modstack",
    subtitle: "Verificações rápidas para problemas comuns de instalação, conta, inicialização do jogo e compatibilidade de mods.",
    sections: [
      { title: "O instalador não abre", items: ["Confirme se o pacote corresponde ao seu sistema operacional.", "Baixe-o novamente pela página oficial se o arquivo estiver incompleto.", "Verifique o histórico de segurança do sistema antes de ignorar um aviso.", "Confirme se sua conta de usuário pode instalar ou executar aplicativos."] },
      { title: "O login não é concluído", paragraphs: ["Confirme se o navegador consegue abrir a página de login do provedor e se o relógio do sistema está correto. Conclua a autenticação apenas no domínio oficial da Microsoft, Google ou Discord mostrado pelo provedor.", "Se a janela de login foi fechada ou interrompida, volte ao Modstack e inicie o processo novamente em vez de compartilhar um código ou senha com outra pessoa."] },
      { title: "O Minecraft fecha durante a inicialização", ordered: true, items: ["Tente iniciar a instância sem os mods adicionados recentemente.", "Verifique se a versão do jogo, o mod loader e todos os mods são compatíveis.", "Restaure as configurações de memória padrão caso tenham sido alteradas recentemente.", "Teste uma instância nova e sem modificações para separar um problema do jogo de um problema de mod."], paragraphs: ["Guarde o relatório de falha ou o log mais recente ao pedir ajuda. Remova tokens de acesso, e-mails e caminhos de arquivos pessoais antes de publicar logs."] },
      { title: "Um modpack ou mundo não funciona", paragraphs: ["Use exatamente as versões do Minecraft e do loader exigidas pelo modpack. Não remova mods de conteúdo de um mundo existente sem fazer backup primeiro. Problemas que ocorrem apenas em um modpack de terceiros podem precisar ser informados ao autor."] },
      { title: "Entre em contato com a comunidade", paragraphs: ["Se essas verificações não resolverem o problema, descreva o que você esperava, o que aconteceu, seu sistema operacional e a versão afetada do Minecraft."] },
    ],
    discord: "Perguntar no Discord",
    email: "Suporte por e-mail",
  },
} as const;

export default function SupportPage() {
  const { language } = useLanguage();
  const page = content[language];

  useEffect(() => {
    document.title = page.pageTitle;
    return () => {
      document.title = "Modstack";
    };
  }, [page.pageTitle]);

  return (
    <InfoPageShell title={page.title} subtitle={page.subtitle}>
      {page.sections.map((section, index) => (
        <InfoSection key={section.title} title={section.title}>
          {"items" in section && section.items && (
            "ordered" in section && section.ordered ? (
              <ol className="list-decimal pl-5 space-y-1">
                {section.items.map((item) => <li key={item}>{item}</li>)}
              </ol>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                {section.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )
          )}
          {"paragraphs" in section && section.paragraphs?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {index === page.sections.length - 1 && (
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="https://discord.gg/nxsDcYVa6s" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-[#5865F2] px-4 py-2 text-sm font-bold text-white">{page.discord}</a>
              <a href="mailto:modstacksupport@gmail.com" className="rounded-lg border border-[#2596be]/40 bg-[#103444]/50 px-4 py-2 text-sm font-bold text-[#2596be]">{page.email}</a>
            </div>
          )}
        </InfoSection>
      ))}
    </InfoPageShell>
  );
}

