import { useEffect } from "react";
import InfoPageShell, { InfoSection } from "../components/InfoPageShell";
import { useLanguage } from "../i18n";

const content = {
  en: {
    pageTitle: "Getting Started Guide - Modstack",
    title: "Getting Started",
    subtitle: "A practical introduction to downloading Modstack, preparing Minecraft, and keeping your instances organized.",
    sections: [
      { title: "1. Download Modstack safely", paragraphs: ["Use the download buttons on the official Modstack homepage. The page detects your operating system, and the “More options” menu provides the available Windows, macOS, and Linux packages.", "Avoid installers redistributed by unrelated websites. If your browser or operating system displays a warning, verify that the file came from a download link on modstack.online before opening it."], items: ["Windows uses the provided installer executable.", "macOS uses the DMG package.", "Linux offers AppImage, DEB, and RPM packages."] },
      { title: "2. Prepare your account and game", paragraphs: ["Open Modstack and use the account controls to add the account you want to play with. Modstack supports switching between Microsoft and offline profiles; only use an offline profile where it is appropriate and permitted.", "Keep your Microsoft credentials private. Authentication is completed through the provider flow, and Modstack should never require you to send a password to another person."] },
      { title: "3. Create a clean instance", paragraphs: ["Start with a separate instance for each Minecraft version or modpack. Keeping instances separate prevents incompatible loaders, configuration files, and mods from being mixed together."], ordered: true, items: ["Select the Minecraft edition and version you intend to use.", "Choose the loader required by the mods or modpack, when applicable.", "Launch the clean instance once before adding extra content.", "Add mods gradually and test again after important changes."] },
      { title: "4. Import mods and modpacks carefully", paragraphs: ["Check that every mod supports the same Minecraft version and loader as the instance. A Fabric mod generally cannot be used in a Forge instance, and a mod built for another Minecraft version may stop the game from starting.", "Back up worlds before changing large mod collections. Worlds can depend on blocks, entities, or dimensions supplied by a mod and may not load correctly after that mod is removed."] },
      { title: "5. Performance basics", paragraphs: ["More allocated memory is not always better. Begin with the modpack developer’s recommendation, close unnecessary background applications, and change one performance setting at a time so you can identify what actually helped.", "If the game stops launching after a change, remove or revert the most recently added mod first. Visit the support page if you need more help."] },
    ],
  },
  es: {
    pageTitle: "Guía de inicio - Modstack",
    title: "Primeros pasos",
    subtitle: "Una introducción práctica para descargar Modstack, preparar Minecraft y mantener tus instancias organizadas.",
    sections: [
      { title: "1. Descarga Modstack de forma segura", paragraphs: ["Usa los botones de descarga de la página oficial de Modstack. La página detecta tu sistema operativo y el menú «Más opciones» muestra los paquetes disponibles para Windows, macOS y Linux.", "Evita instaladores redistribuidos por sitios no relacionados. Si el navegador o el sistema muestra una advertencia, comprueba que el archivo provenga de un enlace de modstack.online antes de abrirlo."], items: ["Windows utiliza el instalador ejecutable proporcionado.", "macOS utiliza el paquete DMG.", "Linux ofrece paquetes AppImage, DEB y RPM."] },
      { title: "2. Prepara tu cuenta y el juego", paragraphs: ["Abre Modstack y usa los controles de cuenta para añadir el perfil con el que quieres jugar. Modstack permite cambiar entre perfiles de Microsoft y offline; utiliza un perfil offline únicamente donde sea apropiado y esté permitido.", "Mantén privadas tus credenciales de Microsoft. La autenticación se completa mediante el proveedor y Modstack nunca debería pedirte que envíes tu contraseña a otra persona."] },
      { title: "3. Crea una instancia limpia", paragraphs: ["Empieza con una instancia separada para cada versión de Minecraft o modpack. Separarlas evita mezclar loaders, archivos de configuración y mods incompatibles."], ordered: true, items: ["Selecciona la edición y versión de Minecraft que vas a utilizar.", "Elige el loader requerido por los mods o el modpack, cuando corresponda.", "Inicia una vez la instancia limpia antes de añadir contenido.", "Añade los mods gradualmente y vuelve a probar después de cambios importantes."] },
      { title: "4. Importa mods y modpacks con cuidado", paragraphs: ["Comprueba que cada mod sea compatible con la misma versión de Minecraft y el mismo loader de la instancia. Un mod de Fabric normalmente no funciona en Forge, y un mod creado para otra versión puede impedir que el juego inicie.", "Haz una copia de seguridad de tus mundos antes de cambiar colecciones grandes de mods. Los mundos pueden depender de bloques, entidades o dimensiones de un mod y podrían no cargar correctamente si lo eliminas."] },
      { title: "5. Rendimiento básico", paragraphs: ["Asignar más memoria no siempre es mejor. Empieza con la recomendación del creador del modpack, cierra aplicaciones innecesarias y cambia un ajuste de rendimiento a la vez para identificar qué ayudó realmente.", "Si el juego deja de iniciar después de un cambio, elimina o revierte primero el mod añadido más recientemente. Visita la página de soporte si necesitas más ayuda."] },
    ],
  },
  pt: {
    pageTitle: "Guia de primeiros passos - Modstack",
    title: "Primeiros passos",
    subtitle: "Uma introdução prática para baixar o Modstack, preparar o Minecraft e manter suas instâncias organizadas.",
    sections: [
      { title: "1. Baixe o Modstack com segurança", paragraphs: ["Use os botões de download da página oficial do Modstack. A página detecta seu sistema operacional e o menu «Mais opções» mostra os pacotes disponíveis para Windows, macOS e Linux.", "Evite instaladores redistribuídos por sites não relacionados. Se o navegador ou o sistema exibir um aviso, confirme que o arquivo veio de um link de modstack.online antes de abri-lo."], items: ["O Windows usa o instalador executável fornecido.", "O macOS usa o pacote DMG.", "O Linux oferece pacotes AppImage, DEB e RPM."] },
      { title: "2. Prepare sua conta e o jogo", paragraphs: ["Abra o Modstack e use os controles de conta para adicionar o perfil com o qual deseja jogar. O Modstack permite alternar entre perfis Microsoft e offline; use um perfil offline apenas quando for apropriado e permitido.", "Mantenha suas credenciais da Microsoft privadas. A autenticação é concluída pelo fluxo do provedor, e o Modstack nunca deve pedir que você envie sua senha para outra pessoa."] },
      { title: "3. Crie uma instância limpa", paragraphs: ["Comece com uma instância separada para cada versão do Minecraft ou modpack. Manter as instâncias separadas evita misturar loaders, arquivos de configuração e mods incompatíveis."], ordered: true, items: ["Selecione a edição e a versão do Minecraft que pretende usar.", "Escolha o loader exigido pelos mods ou pelo modpack, quando aplicável.", "Inicie a instância limpa uma vez antes de adicionar conteúdo.", "Adicione mods gradualmente e teste novamente após mudanças importantes."] },
      { title: "4. Importe mods e modpacks com cuidado", paragraphs: ["Verifique se cada mod é compatível com a mesma versão do Minecraft e o mesmo loader da instância. Um mod do Fabric normalmente não funciona no Forge, e um mod feito para outra versão pode impedir que o jogo inicie.", "Faça backup dos mundos antes de alterar grandes coleções de mods. Os mundos podem depender de blocos, entidades ou dimensões fornecidos por um mod e talvez não carreguem corretamente depois que ele for removido."] },
      { title: "5. Noções básicas de desempenho", paragraphs: ["Alocar mais memória nem sempre é melhor. Comece com a recomendação do criador do modpack, feche aplicativos desnecessários e altere uma configuração de desempenho por vez para identificar o que realmente ajudou.", "Se o jogo parar de iniciar após uma alteração, remova ou reverta primeiro o mod adicionado mais recentemente. Visite a página de suporte se precisar de mais ajuda."] },
    ],
  },
} as const;

export default function GuidesPage() {
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
      {page.sections.map((section) => (
        <InfoSection key={section.title} title={section.title}>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
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
        </InfoSection>
      ))}
    </InfoPageShell>
  );
}

