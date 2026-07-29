import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronDown, Globe2 } from "lucide-react";

type Language = "en" | "es" | "pt";

const languages: Record<Language, { label: string; short: string }> = {
  en: { label: "English", short: "EN" },
  es: { label: "Español", short: "ES" },
  pt: { label: "Português", short: "PT" },
};

const translations: Record<Exclude<Language, "en">, Record<string, string>> = {
  es: {
    "Home": "Inicio",
    "Changelog": "Cambios",
    "About": "Acerca de",
    "Back": "Volver",
    "Join Discord": "Unirse a Discord",
    "Login": "Iniciar sesión",
    "Sign in": "Iniciar sesión",
    "Choose a provider to continue to Modstack.": "Elige un proveedor para continuar a Modstack.",
    "Continue with Google": "Continuar con Google",
    "Continue with Discord": "Continuar con Discord",
    "By signing in you agree to our": "Al iniciar sesión aceptas nuestros",
    "Terms": "Términos",
    "and": "y",
    "Privacy Policy": "Política de privacidad",
    "Back to home": "Volver al inicio",
    "Create your account": "Crea tu cuenta",
    "Choose a username to finish setting up your Modstack account.": "Elige un nombre de usuario para terminar de configurar tu cuenta de Modstack.",
    "Username": "Nombre de usuario",
    "Letters, numbers and underscores": "Letras, números y guiones bajos",
    "3-16 chars (Minecraft rules)": "3-16 caracteres (reglas de Minecraft)",
    "Use my Google / Discord avatar": "Usar mi avatar de Google / Discord",
    "Create account": "Crear cuenta",
    "Creating account...": "Creando cuenta...",
    "By creating an account you agree to our": "Al crear una cuenta aceptas nuestros",
    "Invalid or missing signup token.": "Token de registro inválido o faltante.",
    "Go home": "Ir al inicio",
    "Modstack Account": "Cuenta de Modstack",
    "Change username": "Cambiar nombre",
    "Change avatar": "Cambiar avatar",
    "Remove avatar": "Quitar avatar",
    "Log out": "Cerrar sesión",
    "New username": "Nuevo nombre",
    "Save": "Guardar",
    "Saving...": "Guardando...",
    "Download Modstack": "Descargar Modstack",
    "for Windows": "para Windows",
    "for macOS": "para macOS",
    "for Linux": "para Linux",
    "for Desktop": "para escritorio",
    "Download for Windows": "Descargar para Windows",
    "Download for macOS": "Descargar para macOS",
    "Download for Linux": "Descargar para Linux",
    "Download for Desktop": "Descargar para escritorio",
    "More options": "Más opciones",
    "Modstack is a unique launcher that lets you play your favorite mods and keep them up to date, all in one handy package.": "Modstack es un launcher único que te permite jugar tus mods favoritos y mantenerlos actualizados, todo en un paquete práctico.",
    "Latest Update": "Última actualización",
    "Read changelog": "Leer cambios",
    "Features": "Funciones",
    "Built for every player": "Hecho para todo jugador",
    "Choose a Minecraft launcher that actually puts the community first.": "Elige un launcher de Minecraft que realmente pone a la comunidad primero.",
    "Fast and Lightweight": "Rápido y liviano",
    "ModStack takes almost no resources on your computer. ModStack is also about 20 times smaller than most other launchers": "ModStack usa casi nada de recursos en tu computadora. También es unas 20 veces más pequeño que la mayoría de launchers.",
    "Server Browser": "Explorador de servidores",
    "Easily find Minecraft servers inside the launcher. No need to keep your browser open. We show smaller non P2W servers using": "Encuentra servidores de Minecraft dentro del launcher. No hace falta mantener el navegador abierto. Mostramos servidores pequeños que no son P2W usando",
    "Bedrock and Java Support": "Soporte para Bedrock y Java",
    "Forget just having Java. Play on Bedrock edition too whenever you want": "No te limites a Java. Juega también Bedrock cuando quieras.",
    "Easy Mod installation and imports": "Instalación e importación fácil de mods",
    "No need for any folder archeology. Just download or import your mods inside the launcher": "Sin arqueología de carpetas. Descarga o importa tus mods dentro del launcher.",
    "Account Switcher": "Cambio de cuentas",
    "Easily manage and instantly switch between multiple Microsoft and offline accounts.": "Administra y cambia al instante entre varias cuentas Microsoft y offline.",
    "Sleek Customization": "Personalización elegante",
    "A beautiful, ad-free interface with clean layouts and advanced customization.": "Una interfaz hermosa, sin anuncios, con diseños limpios y personalización avanzada.",
    "Comparison": "Comparación",
    "Why Modstack?": "¿Por qué Modstack?",
    "See how we stack up against other popular launchers.": "Mira cómo nos comparamos con otros launchers populares.",
    "Fast & Lightweight": "Rápido y liviano",
    "Bedrock & Java Support": "Soporte Bedrock y Java",
    "Built-in Server Browser": "Explorador de servidores integrado",
    "Ad-Free Experience": "Experiencia sin anuncios",
    "Music": "Música",
    "Online chat with friends": "Chat en línea con amigos",
    "Featured Modpacks": "Paquetes de mods destacados",
    "The Best Modpacks to try": "Los mejores paquetes de mods para probar",
    "The best modpacks to try using Modstack": "Los mejores paquetes de mods para probar usando Modstack",
    "View Modpack": "Ver paquete de mods",
    "Explorers Odyssey": "Explorers Odyssey",
    "Embark on an epic journey across custom biomes, stunning dimensions, and challenging dungeons.": "Embárcate en un viaje épico por biomas personalizados, dimensiones increíbles y mazmorras desafiantes.",
    "An action RPG fantasy modpack focused on pure survival, exploration, and immersive realism.": "Un modpack RPG de fantasía enfocado en supervivencia, exploración y realismo inmersivo.",
    "A massive kitchen-sink modpack featuring a huge variety of modern tech, magic, and adventure mods.": "Un modpack enorme con una gran variedad de tecnología moderna, magia y aventura.",
    "Custom Minecraft launcher to manage and play your favorite mods.": "Launcher personalizado de Minecraft para administrar y jugar tus mods favoritos.",
    "Community": "Comunidad",
    "Product": "Producto",
    "Legal": "Avisos legales",
    "Terms & Conditions": "Términos y condiciones",
    "Source-Available, not Open Source": "Source-Available, no código abierto",
    "Modstack is": "Modstack es",
    "All rights reserved.": "Todos los derechos reservados.",
    "NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.": "NO ES UN SERVICIO OFICIAL DE MINECRAFT. NO ESTÁ APROBADO NI ASOCIADO CON MOJANG O MICROSOFT.",
    "NOT AN OFFICIAL MINECRAFT PRODUCT.": "NO ES UN PRODUCTO OFICIAL DE MINECRAFT.",
    "Made with": "Hecho con",
    "support:": "soporte:",
    "Keep up-to-date on what's new with Modstack.": "Mantente al día con las novedades de Modstack.",
    "Loading updates...": "Cargando actualizaciones...",
    "Retry": "Reintentar",
    "No changelog entries found.": "No se encontraron entradas de cambios.",
    "Just now": "Ahora mismo",
    "About Modstack": "Acerca de Modstack",
    "The Absolute BEST Minecraft Launcher": "El MEJOR launcher de Minecraft",
    "Our Mission": "Nuestra misión",
    "Modstack was built to be the best Minecraft launcher available. We focused on providing a lightweight, high-performance launcher without compromising on features and actually listening to our users.": "Modstack fue creado para ser el mejor launcher de Minecraft disponible. Nos enfocamos en ofrecer un launcher liviano y de alto rendimiento sin sacrificar funciones, escuchando de verdad a nuestros usuarios.",
    "Key Features & Core Pillars": "Funciones clave y pilares",
    "Ultra-Lightweight Performance": "Rendimiento ultra liviano",
    "Modstack has a footprint 20 times smaller than OTHER launchers, using barely any system resources so your PC's power goes entirely to the game.": "Modstack ocupa 20 veces menos que OTROS launchers y usa muy pocos recursos del sistema, para que la potencia de tu PC vaya al juego.",
    "Java & Bedrock Support": "Soporte Java y Bedrock",
    "Forget having to switch between multiple software packages. Play on Java Edition or Bedrock Edition whenever you want, directly from one interface.": "Olvídate de cambiar entre varios programas. Juega Java Edition o Bedrock Edition cuando quieras, desde una sola interfaz.",
    "Integrated Server Browser": "Explorador de servidores integrado",
    "Browse, filter, and connect to Minecraft servers straight from the launcher. We showcase non-Pay-to-Win and smaller servers to help you actually find a good server.": "Explora, filtra y conéctate a servidores de Minecraft desde el launcher. Mostramos servidores pequeños y no Pay-to-Win para ayudarte a encontrar uno bueno.",
    "No Ads or distractions": "Sin anuncios ni distracciones",
    "Enjoy a clean, ad-free experience without any annoying pop-ups or intrusive marketing. That means no sidebar ads, no cosmetics shop, and nothing similar to adveritising in the launcher.": "Disfruta una experiencia limpia, sin anuncios, pop-ups molestos ni marketing intrusivo. Sin anuncios laterales, tienda cosmética ni nada parecido dentro del launcher.",
    "Transparency & Trust": "Transparencia y confianza",
    "GitHub Repository": "Repositorio de GitHub",
    "The Team": "El equipo",
    "Modstack is crafted and maintained by passionate developers who love the Minecraft community (Unlike the other launchers):": "Modstack es creado y mantenido por desarrolladores apasionados que aman la comunidad de Minecraft (a diferencia de otros launchers):",
    "Lead Creator & Developer": "Creador principal y desarrollador",
    "Support & Community Management": "Soporte y gestión de comunidad",
    "App Contributors:": "Contribuidores de la app:",
    "Website Contributors:": "Contribuidores del sitio:",
    "Studio": "Studio",
    "Export": "Exportar",
    "Skin": "Skin",
    "Minecraft username": "Usuario de Minecraft",
    "Drop a .png skin or": "Suelta una skin .png o",
    "browse": "explora",
    "Arm Model": "Modelo de brazos",
    "Auto": "Auto",
    "Classic": "Clásico",
    "Slim": "Delgado",
    "Recent": "Recientes",
    "Resolution": "Resolución",
    "Model": "Modelo",
    "Tip: load a skin from the left panel.": "Consejo: carga una skin desde el panel izquierdo.",
    "Export Render": "Exportar render",
    "Transparent background": "Fondo transparente",
    "Hide grid floor on render": "Ocultar piso de cuadrícula al renderizar",
    "Download PNG": "Descargar PNG",
    "Copy to clipboard": "Copiar al portapapeles",
    "Copied to clipboard.": "Copiado al portapapeles.",
    "Export failed.": "La exportación falló.",
    "Exported": "Exportado",
    "for Modstack": "de Modstack",
    "of Modstack": "de Modstack",
    "Last updated: June 2026": "Última actualización: junio de 2026",
    "Last updated: May 2026": "Última actualización: mayo de 2026",
    "By using": "Al usar",
    "and our services, you agree to the practices described in this policy. We recommend reading it carefully.": "y nuestros servicios, aceptas las prácticas descritas en esta política. Recomendamos leerla con atención.",
    "1. Information We Collect": "1. Información que recopilamos",
    "When you sign in to Modstack, we collect and store the following information associated with your account:": "Cuando inicias sesión en Modstack, recopilamos y almacenamos la siguiente información asociada con tu cuenta:",
    "Email address": "Dirección de correo electrónico",
    "provided by your authentication provider (Google or Discord).": "proporcionada por tu proveedor de autenticación (Google o Discord).",
    "Provider user ID": "ID de usuario del proveedor",
    "a unique identifier assigned by Google or Discord.": "un identificador único asignado por Google o Discord.",
    "Authentication provider": "Proveedor de autenticación",
    "whether you signed in with Google or Discord.": "si iniciaste sesión con Google o Discord.",
    "Account creation date.": "Fecha de creación de la cuenta.",
    "We do not collect passwords, payment information, or any data beyond what is listed above. We do not use advertising or behavioral tracking.": "No recopilamos contraseñas, información de pago ni datos más allá de lo indicado arriba. No usamos publicidad ni seguimiento de comportamiento.",
    "2. How We Use Your Information": "2. Cómo usamos tu información",
    "The information collected is used solely to:": "La información recopilada se usa únicamente para:",
    "Identify and authenticate your account across sessions.": "Identificar y autenticar tu cuenta entre sesiones.",
    "Associate your preferences and data with your account.": "Asociar tus preferencias y datos con tu cuenta.",
    "Provide support if you contact us.": "Brindarte soporte si nos contactas.",
    "We do not sell, share, or disclose your data to third parties for marketing or any other commercial purpose.": "No vendemos, compartimos ni divulgamos tus datos a terceros con fines de marketing ni con ningún otro propósito comercial.",
    "3. Third-Party Authentication": "3. Autenticación de terceros",
    "Modstack supports sign-in via": "Modstack permite iniciar sesión con",
    ". The authentication process is handled directly by those providers. We never have access to your password. Your login is subject to:": ". El proceso de autenticación lo gestionan directamente esos proveedores. Nunca tenemos acceso a tu contraseña. Tu inicio de sesión está sujeto a:",
    "Google's Privacy Policy": "Política de privacidad de Google",
    "Discord's Privacy Policy": "Política de privacidad de Discord",
    "4. Security": "4. Seguridad",
    "We take reasonable measures to protect the information stored on our servers. Your email and provider ID are stored securely and are never shared with unauthorized parties. We still recommend keeping your Google and Discord credentials confidential.": "Tomamos medidas razonables para proteger la información almacenada en nuestros servidores. Tu correo e ID de proveedor se guardan de forma segura y nunca se comparten con partes no autorizadas. Aun así, recomendamos mantener confidenciales tus credenciales de Google y Discord.",
    "5. Data Retention": "5. Retención de datos",
    "Your account data is retained as long as you have an active account with Modstack. If you wish to have your data deleted, contact us at the email below and we will remove it promptly.": "Los datos de tu cuenta se conservan mientras tengas una cuenta activa con Modstack. Si quieres que eliminemos tus datos, contáctanos al correo de abajo y los retiraremos pronto.",
    "6. Minors": "6. Menores",
    "Our services are not directed at children under the age of 13. We do not knowingly collect data from anyone under 13.": "Nuestros servicios no están dirigidos a menores de 13 años. No recopilamos intencionalmente datos de personas menores de 13 años.",
    "7. Changes to This Policy": "7. Cambios a esta política",
    "We reserve the right to update this privacy policy at any time. We will notify you of significant changes through the platform.": "Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. Te notificaremos los cambios importantes a través de la plataforma.",
    "8. Contact": "8. Contacto",
    "If you have any questions about this policy or want to request data deletion, feel free to reach out:": "Si tienes preguntas sobre esta política o quieres solicitar la eliminación de datos, puedes contactarnos:",
    "By downloading, installing, or using": "Al descargar, instalar o usar",
    "you automatically agree to all the terms and conditions described in this document. If you disagree with any of them, you must uninstall the application immediately and refrain from using it.": "aceptas automáticamente todos los términos y condiciones descritos en este documento. Si no estás de acuerdo con alguno de ellos, debes desinstalar la aplicación inmediatamente y dejar de usarla.",
    "1. Ownership and Intellectual Property": "1. Propiedad e intelectual",
    "Modstack, including its source code, design, logos, graphic resources, multimedia, and any other associated elements, is the exclusive property of its developers. All rights are reserved. No element of the Application may be reproduced, distributed, modified, or used for commercial purposes without the express written authorization of the rights holders.": "Modstack, incluyendo su código fuente, diseño, logos, recursos gráficos, multimedia y cualquier otro elemento asociado, es propiedad exclusiva de sus desarrolladores. Todos los derechos están reservados. Ningún elemento de la aplicación puede reproducirse, distribuirse, modificarse ni usarse con fines comerciales sin autorización expresa por escrito de los titulares de derechos.",
    "2. Usage Restrictions": "2. Restricciones de uso",
    "The following are strictly prohibited:": "Está estrictamente prohibido:",
    "Distributing, sharing, reselling, or sublicensing the Application or any of its components to third parties.": "Distribuir, compartir, revender o sublicenciar la aplicación o cualquiera de sus componentes a terceros.",
    "Reproducing or redistributing resources downloaded through the Application, including images, multimedia files, configurations, and internal documents.": "Reproducir o redistribuir recursos descargados mediante la aplicación, incluyendo imágenes, archivos multimedia, configuraciones y documentos internos.",
    "Modifying, altering, decompiling, reverse engineering, or attempting to access the source code of the Application in any way.": "Modificar, alterar, descompilar, aplicar ingeniería inversa o intentar acceder al código fuente de la aplicación de cualquier forma.",
    "Tampering with, bypassing, or interfering with the Application's security, verification, or authentication systems.": "Manipular, evadir o interferir con los sistemas de seguridad, verificación o autenticación de la aplicación.",
    "Using the Application for illegal, fraudulent purposes or in any way that may cause harm to third parties.": "Usar la aplicación con fines ilegales, fraudulentos o de cualquier forma que pueda causar daño a terceros.",
    "3. Disclaimer of Liability": "3. Descargo de responsabilidad",
    "Modstack is provided": "Modstack se proporciona",
    "\"as is\"": "\"tal cual\"",
    ", without warranties of any kind, whether express or implied. The developers are not responsible for:": ", sin garantías de ningún tipo, expresas o implícitas. Los desarrolladores no son responsables de:",
    "Bugs, technical failures, or interruptions in the Application's operation.": "Errores, fallas técnicas o interrupciones en el funcionamiento de la aplicación.",
    "Loss of data, files, or configurations resulting from use of the Application.": "Pérdida de datos, archivos o configuraciones derivada del uso de la aplicación.",
    "Direct, indirect, incidental, or consequential damages caused by the use or inability to use the Application.": "Daños directos, indirectos, incidentales o consecuentes causados por el uso o la imposibilidad de usar la aplicación.",
    "Issues arising from third-party services, platforms, or software.": "Problemas derivados de servicios, plataformas o software de terceros.",
    "Incompatibilities with the operating system or other software installed on the user's device.": "Incompatibilidades con el sistema operativo u otro software instalado en el dispositivo del usuario.",
    "4. Security Warnings": "4. Advertencias de seguridad",
    "Modstack does not have a Windows digital signature or a verified publisher certificate. As a result, some security systems such as Windows Defender or other antivirus programs may display alerts or false positives when downloading or running the Application.": "Modstack no tiene firma digital de Windows ni certificado de editor verificado. Por eso, algunos sistemas de seguridad como Windows Defender u otros antivirus pueden mostrar alertas o falsos positivos al descargar o ejecutar la aplicación.",
    "These warnings do not imply that the Application contains malware, viruses, or malicious code of any kind. By installing Modstack, the user acknowledges this situation and agrees to run the Application at their own risk.": "Estas advertencias no implican que la aplicación contenga malware, virus o código malicioso de ningún tipo. Al instalar Modstack, el usuario reconoce esta situación y acepta ejecutar la aplicación bajo su propio riesgo.",
    "5. Use at the User's Own Risk": "5. Uso bajo responsabilidad del usuario",
    "Use of Modstack is entirely voluntary and is carried out at the user's sole responsibility. By installing the Application, the user agrees that any consequences arising from its use, whether direct or indirect, will be borne entirely by themselves, releasing the developers from any liability in that regard.": "El uso de Modstack es completamente voluntario y se realiza bajo la exclusiva responsabilidad del usuario. Al instalar la aplicación, el usuario acepta que cualquier consecuencia derivada de su uso, directa o indirecta, será asumida por sí mismo, liberando a los desarrolladores de cualquier responsabilidad al respecto.",
    "6. Updates and Modifications to the Application": "6. Actualizaciones y modificaciones de la aplicación",
    "The developers of Modstack reserve the right to release updates, modify features, suspend the service, or discontinue the Application at any time and without prior notice, without incurring any obligation or liability toward the user.": "Los desarrolladores de Modstack se reservan el derecho de lanzar actualizaciones, modificar funciones, suspender el servicio o discontinuar la aplicación en cualquier momento y sin previo aviso, sin asumir obligación ni responsabilidad hacia el usuario.",
    "7. Modifications to the Terms and Conditions": "7. Modificaciones a los términos y condiciones",
    "Modstack reserves the right to modify this document at any time. Changes will take effect upon publication. Continued use of the Application after changes are published implies full acceptance of the updated terms. Users are encouraged to review this document periodically.": "Modstack se reserva el derecho de modificar este documento en cualquier momento. Los cambios entrarán en vigor al publicarse. El uso continuado de la aplicación después de publicados los cambios implica la aceptación total de los términos actualizados. Se recomienda a los usuarios revisar este documento periódicamente.",
    "8. Acceptance of Terms": "8. Aceptación de términos",
    "Downloading, installing, or using": "Descargar, instalar o usar",
    "constitutes full, voluntary, and unconditional acceptance of all the terms and conditions described herein. If you do not agree with any of them, you must refrain from using the Application.": "constituye la aceptación total, voluntaria e incondicional de todos los términos y condiciones descritos aquí. Si no estás de acuerdo con alguno de ellos, debes abstenerte de usar la aplicación.",
    "9. Contact": "9. Contacto",
    "If you have any questions about this policy, you can contact us:": "Si tienes preguntas sobre esta política, puedes contactarnos:",
    "Email:": "Correo:",
    "Discord:": "Discord:",
    "Could not load default skin. Upload one to begin.": "No se pudo cargar la skin predeterminada. Sube una para comenzar.",
    "Loading default skin...": "Cargando skin predeterminada...",
    "Pose Presets": "Poses predefinidas",
    "Standing": "De pie",
    "Walking": "Caminando",
    "Running": "Corriendo",
    "Waving": "Saludando",
    "Pointing": "Apuntando",
    "Fighting": "Peleando",
    "Sitting": "Sentado",
    "Leaning": "Inclinado",
    "Arms Crossed": "Brazos cruzados",
    "Dabbing": "Dabbing",
    "T-Pose": "T-Pose",
    "Victory": "Victoria",
    "Custom Poses": "Poses personalizadas",
    "Pose name": "Nombre de la postura",
    "Save current pose": "Guardar postura actual",
    "Export all as JSON": "Exportar todo como JSON",
    "Import poses JSON": "Importar poses JSON",
    "No saved poses yet. Pose the model then click save.": "Aún no hay poses guardadas. Posiciona el modelo y luego haz clic en guardar.",
    "Delete": "Eliminar",
    "Scene": "Escena",
    "Background": "Fondo",
    "None": "Ninguno",
    "Solid": "Sólido",
    "Lighting": "Iluminación",
    "Ambient": "Ambiente",
    "Light Source": "Fuente de luz",
    "Cast shadows": "Proyectar sombras",
    "Camera": "Cámara",
    "Zoom": "Zoom",
    "FOV": "Campo de visión",
    "Reset Camera": "Restablecer cámara",
    "Grid Floor": "Piso de cuadrícula",
    "Show grid": "Mostrar cuadrícula",
    "Default Export Size": "Tamaño de exportación predeterminado",
    "Pose": "Postura",
    "L Arm": "Brazo izq.",
    "R Arm": "Brazo der.",
    "Head": "Cabeza",
    "Body": "Cuerpo",
    "L Leg": "Pierna izq.",
    "R Leg": "Pierna der.",
    "Left Arm": "Brazo izquierdo",
    "Right Arm": "Brazo derecho",
    "Left Leg": "Pierna izquierda",
    "Right Leg": "Pierna derecha",
    "Reset All": "Restablecer todo",
    "Mirror": "Espejar",
    "Reset part": "Restablecer parte",
    "Sliders are read-only while an animation is playing. Stop the animation to pose manually.": "Los deslizadores son de solo lectura mientras se reproduce una animación. Detén la animación para posar manualmente.",
    "X (Pitch)": "X (Inclinación)",
    "Y (Yaw)": "Y (Giro)",
    "Z (Roll)": "Z (Rotación)",
    "Animation": "Animación",
    "Idle": "Reposo",
    "Walk": "Caminar",
    "Run": "Correr",
    "Fly": "Volar",
    "Manual pose controls are locked while animating.": "Los controles manuales de pose están bloqueados durante la animación.",
    "Skin & Scene": "Skin y escena",
    "Undo (Ctrl+Z)": "Deshacer (Ctrl+Z)",
    "Redo (Ctrl+Shift+Z)": "Rehacer (Ctrl+Shift+Z)",
    "Reset pose": "Restablecer postura",
    "Reset camera": "Restablecer cámara",
    "Pose controls": "Controles de postura",
    "Only PNG skin files are supported.": "Solo se admiten archivos de skin PNG.",
    "Failed to load that skin file.": "No se pudo cargar ese archivo de skin.",
    "Failed to reload.": "No se pudo recargar.",
    "Viewport not ready yet": "La vista aún no está lista",
    "Detected:": "Detectado:",
    "Slim (Alex)": "Delgado (Alex)",
    "Classic (Steve)": "Clásico (Steve)",
    "Clipboard copy failed.": "No se pudo copiar al portapapeles.",
    "Clipboard write not supported here. Use Download.": "La escritura al portapapeles no está disponible aquí. Usa Descargar.",
    "(PNG alpha)": "(alfa PNG)",
    "High resolutions (4K) require a capable GPU. If the canvas goes blank or the tab freezes, fall back to 1080p.": "Las resoluciones altas (4K) requieren una GPU capaz. Si el lienzo queda en blanco o la pestaña se congela, vuelve a 1080p.",
    "Username must be 3-16 characters: letters, numbers and _": "El nombre debe tener 3-16 caracteres: letras, números y _",
    "Username must be 3–16 characters: letters, numbers and _": "El nombre debe tener 3-16 caracteres: letras, números y _",
    "Failed to update username.": "No se pudo actualizar el nombre.",
    "Failed to create account.": "No se pudo crear la cuenta.",
    "Network error. Try again.": "Error de red. Inténtalo de nuevo.",
    "Network error. Please try again.": "Error de red. Inténtalo de nuevo.",
    "Only PNG, JPEG, WEBP, or GIF files are allowed.": "Solo se permiten archivos PNG, JPEG, WEBP o GIF.",
    "Max file size is 5MB.": "El tamaño máximo es 5 MB.",
    "Failed to upload avatar.": "No se pudo subir el avatar.",
    "Network error uploading avatar.": "Error de red al subir el avatar.",
    "Remove your avatar?": "¿Quitar tu avatar?",
    "Failed to remove avatar.": "No se pudo quitar el avatar.",
    "Network error.": "Error de red.",
    "Change language": "Cambiar idioma",
    "Privacy Policy for Modstack": "Política de privacidad de Modstack",
    "Terms & Conditions of Modstack": "Términos y condiciones de Modstack",
    "Modstack is a": "Modstack es una aplicación",
    "application. We": ". Nosotros",
    "believe in transparency, allowing players to view the codebase on our official": "creemos en la transparencia, permitiendo que los jugadores vean el código en nuestro",
    ". You can inspect the implementation details, and see how Modstack works. This does not mean that you can create a launcher based off Modstack though": ". Puedes inspeccionar los detalles de implementación y ver cómo funciona Modstack. Eso no significa que puedas crear un launcher basado en Modstack.",
    "Resolution:": "Resolución:",
    "FPS:": "FPS:",
    "Model:": "Modelo:",
    "Modstack Studio": "Modstack Studio",
    "default": "clásico",
    "slim": "delgado",
    "3–16 chars (Minecraft rules)": "3-16 caracteres (reglas de Minecraft)",
    "source-available": "source-available",
    "title": "título",
    "logo": "logo",
    "skin preview": "vista previa de skin",
    "More download options": "Más opciones de descarga",
    "© 2026 Modstack. All rights reserved.": "© 2026 Modstack. Todos los derechos reservados.",
    "© 2026 Modstack. All rights reserved. NOT AN OFFICIAL MINECRAFT PRODUCT.": "© 2026 Modstack. Todos los derechos reservados. NO ES UN PRODUCTO OFICIAL DE MINECRAFT.",
    "support: @fitzxel & @gekoxd": "soporte: @fitzxel & @gekoxd",
    "Modstack Launcher Preview": "Vista previa de Modstack Launcher",
    " application. We believe in transparency, allowing players to view the codebase on our official": " aplicación. Creemos en la transparencia, permitiendo que los jugadores vean el código en nuestro",
    "@fitzxel & @gekoxd — Support & Community Management": "@fitzxel & @gekoxd — Soporte y gestión de comunidad",
    "— Support & Community Management": "— Soporte y gestión de comunidad",
    ", you automatically agree to all the terms and conditions described in this document. If you disagree with any of them, you must uninstall the application immediately and refrain from using it.": ", aceptas automáticamente todos los términos y condiciones descritos en este documento. Si no estás de acuerdo con alguno de ellos, debes desinstalar la aplicación inmediatamente y dejar de usarla.",
    "← Back to home": "← Volver al inicio",
    "You can now customize the launcher's accent color.": "Ahora puedes personalizar el color de acento del launcher.",
    "You can now set your Java installation manually without needing to install it through the launcher.": "Ahora puedes configurar tu instalación de Java manualmente sin tener que instalarla desde el launcher.",
    "You can now create groups with your friends in the chat.": "Ahora puedes crear grupos con tus amigos en el chat.",
    "Remember that bugs may still exist, so if you find any please report them in https://discord.gg/BWGab5AqPJ THANK YOU FOR YOUR SUPPORT!": "Recuerda que todavía puede haber errores; si encuentras alguno, repórtalo en https://discord.gg/BWGab5AqPJ. ¡GRACIAS POR TU APOYO!",
    "Redesigned the Home and Chat interfaces.": "Se rediseñaron las interfaces de Inicio y Chat.",
    "Added Featured Servers such as Hypixel and CubeCraft.": "Se agregaron servidores destacados como Hypixel y CubeCraft.",
    "Clicking on a server now checks whether you have an instance with the required Minecraft version.": "Al hacer clic en un servidor ahora se revisa si tienes una instancia con la versión de Minecraft requerida.",
    "Home has been renamed to \"Dashboard\".": "Inicio ahora se llama \"Dashboard\".",
    "I don't know what else to add to the changelog. There were so many changes.": "No sé qué más agregar al changelog. Hubo muchísimos cambios.",
    "Added support for CurseForge modpacks.": "Se agregó soporte para paquetes de mods de CurseForge.",
    "Redesigned the Instances and Home pages.": "Se rediseñaron las páginas de Instancias e Inicio.",
    "Added filter bar to the Modpacks section": "Se agregó una barra de filtros a la sección de paquetes de mods",
    "Minor design changes were added": "Se agregaron cambios menores de diseño",
    "We added something special a Modstack Installer that makes the installation process way easier. It's something I've always wanted to build, so if you want to try it out, you can download it from the website. Keep in mind it's Windows-only for now, and the code is Source-Available": "Agregamos algo especial: un instalador de Modstack que hace el proceso de instalación mucho más fácil. Es algo que siempre quise construir, así que si quieres probarlo puedes descargarlo desde el sitio. Ten en cuenta que por ahora es solo para Windows y el código es Source-Available.",
    "Modstack Installer: https://github.com/Modstack-Launcher/ModstackInstaller": "Instalador de Modstack: https://github.com/Modstack-Launcher/ModstackInstaller",
    "Modstack v1.1.1 Fix update": "Actualización de correcciones Modstack v1.1.1",
    "Added 100% launcher translation in Spanish and Portuguese (more languages coming soon)": "Se agregó traducción 100% del launcher en español y portugués (más idiomas próximamente)",
    "The website received changes to support the friends system": "El sitio recibió cambios para soportar el sistema de amigos",
    "Added version filters per loader, only showing supported versions (e.g. selecting Fabric will only show versions from 1.14 onwards)": "Se agregaron filtros de versión por loader, mostrando solo versiones compatibles (por ejemplo, al seleccionar Fabric solo se muestran versiones desde 1.14 en adelante)",
    "The launcher color scheme has been completely revamped": "La paleta de colores del launcher fue renovada por completo",
    "Forge metadata support has been added": "Se agregó soporte para metadatos de Forge",
    "You can now change the Bedrock background": "Ahora puedes cambiar el fondo de Bedrock",
    "Added playtime tracking": "Se agregó seguimiento de tiempo de juego",
    "Redesigned the Loading screen": "Se rediseñó la pantalla de carga",
    "And finally.. after a lot of effort we're out of Beta and welcoming the OFFICIAL STABLE version, thank you all for your amazing support to Modstack": "Y finalmente... después de mucho esfuerzo salimos de Beta y damos la bienvenida a la versión OFICIAL ESTABLE. Gracias a todos por su increíble apoyo a Modstack.",
    "Added a Server Browser": "Se agregó un explorador de servidores",
    "Added NeoForge support and version 26.1.2": "Se agregó soporte para NeoForge y la versión 26.1.2",
    "Fixed the issue where mods were not loading": "Se corrigió el problema donde los mods no cargaban",
    "Added support for importing Modrinth (.mrpack) and CurseForge (.zip) modpacks": "Se agregó soporte para importar paquetes de mods de Modrinth (.mrpack) y CurseForge (.zip)",
    "Added Minecraft Bedrock support": "Se agregó soporte para Minecraft Bedrock",
    "Added the ability to choose modpack versions": "Se agregó la opción de elegir versiones de paquetes de mods",
    "Added CurseForge support": "Se agregó soporte para CurseForge",
    "Added the ability to set a custom path": "Se agregó la opción de establecer una ruta personalizada",
    "🎉 AND THE CHERRY ON TOP — THE CODE IS NOW OPEN-SOURCE!!! well... I mean it's Source-Available, not Open Source.": "🎉 Y LA CEREZA DEL PASTEL: ¡¡¡EL CÓDIGO AHORA ES CÓDIGO ABIERTO!!! bueno... quiero decir Source-Available, no código abierto.",
    "Create your own instances to play Minecraft comfortably or install modpacks to your liking!": "Crea tus propias instancias para jugar Minecraft cómodamente o instala paquetes de mods a tu gusto.",
    "The launcher is now fully in English": "El launcher ahora está completamente en inglés",
    "Modpacks are now available": "Los paquetes de mods ya están disponibles",
    "Thanks for all the support — this is just the beginning! For bugs or feedback join the Discord: https://discord.gg/nxsDcYVa6s": "Gracias por todo el apoyo. ¡Esto apenas empieza! Para reportar errores o enviar comentarios, únete al Discord: https://discord.gg/nxsDcYVa6s",
    "The launcher now supports Fabric": "El launcher ahora soporta Fabric",
  },
  pt: {
    "Home": "Início",
    "Changelog": "Alterações",
    "About": "Sobre",
    "Back": "Voltar",
    "Join Discord": "Entrar no Discord",
    "Login": "Entrar",
    "Sign in": "Entrar",
    "Choose a provider to continue to Modstack.": "Escolha um provedor para continuar no Modstack.",
    "Continue with Google": "Continuar com Google",
    "Continue with Discord": "Continuar com Discord",
    "By signing in you agree to our": "Ao entrar, você aceita nossos",
    "Terms": "Termos",
    "and": "e",
    "Privacy Policy": "Política de privacidade",
    "Back to home": "Voltar ao início",
    "Create your account": "Crie sua conta",
    "Choose a username to finish setting up your Modstack account.": "Escolha um nome de usuário para terminar de configurar sua conta Modstack.",
    "Username": "Nome de usuário",
    "Letters, numbers and underscores": "Letras, números e sublinhados",
    "3-16 chars (Minecraft rules)": "3-16 caracteres (regras do Minecraft)",
    "Use my Google / Discord avatar": "Usar meu avatar do Google / Discord",
    "Create account": "Criar conta",
    "Creating account...": "Criando conta...",
    "By creating an account you agree to our": "Ao criar uma conta, você aceita nossos",
    "Invalid or missing signup token.": "Token de cadastro inválido ou ausente.",
    "Go home": "Ir para o início",
    "Modstack Account": "Conta Modstack",
    "Change username": "Alterar nome",
    "Change avatar": "Alterar avatar",
    "Remove avatar": "Remover avatar",
    "Log out": "Sair",
    "New username": "Novo nome",
    "Save": "Salvar",
    "Saving...": "Salvando...",
    "Download Modstack": "Baixar Modstack",
    "for Windows": "para Windows",
    "for macOS": "para macOS",
    "for Linux": "para Linux",
    "for Desktop": "para desktop",
    "Download for Windows": "Baixar para Windows",
    "Download for macOS": "Baixar para macOS",
    "Download for Linux": "Baixar para Linux",
    "Download for Desktop": "Baixar para desktop",
    "More options": "Mais opções",
    "Modstack is a unique launcher that lets you play your favorite mods and keep them up to date, all in one handy package.": "Modstack é um launcher único que permite jogar seus mods favoritos e mantê-los atualizados, tudo em um pacote prático.",
    "Latest Update": "Última atualização",
    "Read changelog": "Ler alterações",
    "Features": "Recursos",
    "Built for every player": "Feito para todo jogador",
    "Choose a Minecraft launcher that actually puts the community first.": "Escolha um launcher de Minecraft que realmente coloca a comunidade em primeiro lugar.",
    "Fast and Lightweight": "Rápido e leve",
    "ModStack takes almost no resources on your computer. ModStack is also about 20 times smaller than most other launchers": "ModStack usa quase nenhum recurso do seu computador. Também é cerca de 20 vezes menor que a maioria dos launchers.",
    "Server Browser": "Navegador de servidores",
    "Easily find Minecraft servers inside the launcher. No need to keep your browser open. We show smaller non P2W servers using": "Encontre servidores de Minecraft dentro do launcher. Não precisa manter o navegador aberto. Mostramos servidores menores que não são P2W usando",
    "Bedrock and Java Support": "Suporte a Bedrock e Java",
    "Forget just having Java. Play on Bedrock edition too whenever you want": "Não fique só no Java. Jogue também a edição Bedrock quando quiser.",
    "Easy Mod installation and imports": "Instalação e importação fácil de mods",
    "No need for any folder archeology. Just download or import your mods inside the launcher": "Sem arqueologia de pastas. Baixe ou importe seus mods dentro do launcher.",
    "Account Switcher": "Troca de contas",
    "Easily manage and instantly switch between multiple Microsoft and offline accounts.": "Gerencie e alterne instantaneamente entre várias contas Microsoft e offline.",
    "Sleek Customization": "Personalização elegante",
    "A beautiful, ad-free interface with clean layouts and advanced customization.": "Uma interface bonita, sem anúncios, com layouts limpos e personalização avançada.",
    "Comparison": "Comparação",
    "Why Modstack?": "Por que Modstack?",
    "See how we stack up against other popular launchers.": "Veja como nos comparamos com outros launchers populares.",
    "Fast & Lightweight": "Rápido e leve",
    "Bedrock & Java Support": "Suporte Bedrock e Java",
    "Built-in Server Browser": "Navegador de servidores integrado",
    "Ad-Free Experience": "Experiência sem anúncios",
    "Music": "Música",
    "Online chat with friends": "Chat online com amigos",
    "Featured Modpacks": "Pacotes de mods em destaque",
    "The Best Modpacks to try": "Os melhores pacotes de mods para testar",
    "The best modpacks to try using Modstack": "Os melhores pacotes de mods para testar usando Modstack",
    "View Modpack": "Ver pacote de mods",
    "Explorers Odyssey": "Explorers Odyssey",
    "Embark on an epic journey across custom biomes, stunning dimensions, and challenging dungeons.": "Embarque em uma jornada épica por biomas personalizados, dimensões incríveis e masmorras desafiadoras.",
    "An action RPG fantasy modpack focused on pure survival, exploration, and immersive realism.": "Um modpack RPG de fantasia focado em sobrevivência, exploração e realismo imersivo.",
    "A massive kitchen-sink modpack featuring a huge variety of modern tech, magic, and adventure mods.": "Um modpack enorme com grande variedade de tecnologia moderna, magia e aventura.",
    "Custom Minecraft launcher to manage and play your favorite mods.": "Launcher personalizado de Minecraft para gerenciar e jogar seus mods favoritos.",
    "Community": "Comunidade",
    "Product": "Produto",
    "Legal": "Jurídico",
    "Terms & Conditions": "Termos e condições",
    "Source-Available, not Open Source": "Source-Available, não código aberto",
    "Modstack is": "Modstack é",
    "All rights reserved.": "Todos os direitos reservados.",
    "NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.": "NÃO É UM SERVIÇO OFICIAL DO MINECRAFT. NÃO É APROVADO NEM ASSOCIADO À MOJANG OU MICROSOFT.",
    "NOT AN OFFICIAL MINECRAFT PRODUCT.": "NÃO É UM PRODUTO OFICIAL DO MINECRAFT.",
    "Made with": "Feito com",
    "support:": "suporte:",
    "Keep up-to-date on what's new with Modstack.": "Fique por dentro das novidades do Modstack.",
    "Loading updates...": "Carregando atualizações...",
    "Retry": "Tentar novamente",
    "No changelog entries found.": "Nenhuma entrada de alterações encontrada.",
    "Just now": "Agora mesmo",
    "About Modstack": "Sobre o Modstack",
    "The Absolute BEST Minecraft Launcher": "O MELHOR launcher de Minecraft",
    "Our Mission": "Nossa missão",
    "Modstack was built to be the best Minecraft launcher available. We focused on providing a lightweight, high-performance launcher without compromising on features and actually listening to our users.": "Modstack foi criado para ser o melhor launcher de Minecraft disponível. Focamos em oferecer um launcher leve e de alto desempenho sem abrir mão de recursos, ouvindo de verdade nossos usuários.",
    "Key Features & Core Pillars": "Recursos principais e pilares",
    "Ultra-Lightweight Performance": "Desempenho ultraleve",
    "Modstack has a footprint 20 times smaller than OTHER launchers, using barely any system resources so your PC's power goes entirely to the game.": "Modstack ocupa 20 vezes menos que OUTROS launchers e usa pouquíssimos recursos do sistema, para que a potência do seu PC vá para o jogo.",
    "Java & Bedrock Support": "Suporte Java e Bedrock",
    "Forget having to switch between multiple software packages. Play on Java Edition or Bedrock Edition whenever you want, directly from one interface.": "Esqueça alternar entre vários programas. Jogue Java Edition ou Bedrock Edition quando quiser, direto de uma interface.",
    "Integrated Server Browser": "Navegador de servidores integrado",
    "Browse, filter, and connect to Minecraft servers straight from the launcher. We showcase non-Pay-to-Win and smaller servers to help you actually find a good server.": "Navegue, filtre e conecte-se a servidores de Minecraft direto do launcher. Mostramos servidores menores e não Pay-to-Win para ajudar você a encontrar um bom servidor.",
    "No Ads or distractions": "Sem anúncios ou distrações",
    "Enjoy a clean, ad-free experience without any annoying pop-ups or intrusive marketing. That means no sidebar ads, no cosmetics shop, and nothing similar to adveritising in the launcher.": "Aproveite uma experiência limpa, sem anúncios, pop-ups irritantes ou marketing invasivo. Sem anúncios laterais, loja cosmética ou algo parecido no launcher.",
    "Transparency & Trust": "Transparência e confiança",
    "GitHub Repository": "Repositório GitHub",
    "The Team": "A equipe",
    "Modstack is crafted and maintained by passionate developers who love the Minecraft community (Unlike the other launchers):": "Modstack é criado e mantido por desenvolvedores apaixonados que amam a comunidade Minecraft (ao contrário de outros launchers):",
    "Lead Creator & Developer": "Criador principal e desenvolvedor",
    "Support & Community Management": "Suporte e gestão da comunidade",
    "App Contributors:": "Contribuidores do app:",
    "Website Contributors:": "Contribuidores do site:",
    "Studio": "Studio",
    "Export": "Exportar",
    "Skin": "Skin",
    "Minecraft username": "Usuário do Minecraft",
    "Drop a .png skin or": "Solte uma skin .png ou",
    "browse": "procurar",
    "Arm Model": "Modelo dos braços",
    "Auto": "Auto",
    "Classic": "Clássico",
    "Slim": "Fino",
    "Recent": "Recentes",
    "Resolution": "Resolução",
    "Model": "Modelo",
    "Tip: load a skin from the left panel.": "Dica: carregue uma skin pelo painel esquerdo.",
    "Export Render": "Exportar render",
    "Transparent background": "Fundo transparente",
    "Hide grid floor on render": "Ocultar chão da grade no render",
    "Download PNG": "Baixar PNG",
    "Copy to clipboard": "Copiar para a área de transferência",
    "Copied to clipboard.": "Copiado para a área de transferência.",
    "Export failed.": "A exportação falhou.",
    "Exported": "Exportado",
    "for Modstack": "do Modstack",
    "of Modstack": "do Modstack",
    "Last updated: June 2026": "Última atualização: junho de 2026",
    "Last updated: May 2026": "Última atualização: maio de 2026",
    "By using": "Ao usar",
    "and our services, you agree to the practices described in this policy. We recommend reading it carefully.": "e nossos serviços, você aceita as práticas descritas nesta política. Recomendamos lê-la com atenção.",
    "1. Information We Collect": "1. Informações que coletamos",
    "When you sign in to Modstack, we collect and store the following information associated with your account:": "Quando você entra no Modstack, coletamos e armazenamos as seguintes informações associadas à sua conta:",
    "Email address": "Endereço de e-mail",
    "provided by your authentication provider (Google or Discord).": "fornecido pelo seu provedor de autenticação (Google ou Discord).",
    "Provider user ID": "ID de usuário do provedor",
    "a unique identifier assigned by Google or Discord.": "um identificador único atribuído pelo Google ou Discord.",
    "Authentication provider": "Provedor de autenticação",
    "whether you signed in with Google or Discord.": "se você entrou com Google ou Discord.",
    "Account creation date.": "Data de criação da conta.",
    "We do not collect passwords, payment information, or any data beyond what is listed above. We do not use advertising or behavioral tracking.": "Não coletamos senhas, informações de pagamento ou qualquer dado além do listado acima. Não usamos publicidade nem rastreamento comportamental.",
    "2. How We Use Your Information": "2. Como usamos suas informações",
    "The information collected is used solely to:": "As informações coletadas são usadas somente para:",
    "Identify and authenticate your account across sessions.": "Identificar e autenticar sua conta entre sessões.",
    "Associate your preferences and data with your account.": "Associar suas preferências e dados à sua conta.",
    "Provide support if you contact us.": "Fornecer suporte se você entrar em contato.",
    "We do not sell, share, or disclose your data to third parties for marketing or any other commercial purpose.": "Não vendemos, compartilhamos ou divulgamos seus dados a terceiros para marketing ou qualquer outro fim comercial.",
    "3. Third-Party Authentication": "3. Autenticação de terceiros",
    "Modstack supports sign-in via": "O Modstack permite login via",
    ". The authentication process is handled directly by those providers. We never have access to your password. Your login is subject to:": ". O processo de autenticação é feito diretamente por esses provedores. Nunca temos acesso à sua senha. Seu login está sujeito a:",
    "Google's Privacy Policy": "Política de privacidade do Google",
    "Discord's Privacy Policy": "Política de privacidade do Discord",
    "4. Security": "4. Segurança",
    "We take reasonable measures to protect the information stored on our servers. Your email and provider ID are stored securely and are never shared with unauthorized parties. We still recommend keeping your Google and Discord credentials confidential.": "Tomamos medidas razoáveis para proteger as informações armazenadas em nossos servidores. Seu e-mail e ID de provedor são guardados com segurança e nunca são compartilhados com partes não autorizadas. Ainda recomendamos manter suas credenciais do Google e Discord em sigilo.",
    "5. Data Retention": "5. Retenção de dados",
    "Your account data is retained as long as you have an active account with Modstack. If you wish to have your data deleted, contact us at the email below and we will remove it promptly.": "Os dados da sua conta são mantidos enquanto você tiver uma conta ativa no Modstack. Se quiser excluir seus dados, entre em contato pelo e-mail abaixo e removeremos prontamente.",
    "6. Minors": "6. Menores",
    "Our services are not directed at children under the age of 13. We do not knowingly collect data from anyone under 13.": "Nossos serviços não são direcionados a crianças menores de 13 anos. Não coletamos intencionalmente dados de menores de 13 anos.",
    "7. Changes to This Policy": "7. Alterações nesta política",
    "We reserve the right to update this privacy policy at any time. We will notify you of significant changes through the platform.": "Reservamo-nos o direito de atualizar esta política de privacidade a qualquer momento. Avisaremos sobre alterações importantes pela plataforma.",
    "8. Contact": "8. Contato",
    "If you have any questions about this policy or want to request data deletion, feel free to reach out:": "Se tiver dúvidas sobre esta política ou quiser solicitar exclusão de dados, entre em contato:",
    "By downloading, installing, or using": "Ao baixar, instalar ou usar",
    "you automatically agree to all the terms and conditions described in this document. If you disagree with any of them, you must uninstall the application immediately and refrain from using it.": "você aceita automaticamente todos os termos e condições descritos neste documento. Se discordar de qualquer um deles, deve desinstalar o aplicativo imediatamente e deixar de usá-lo.",
    "1. Ownership and Intellectual Property": "1. Propriedade e propriedade intelectual",
    "Modstack, including its source code, design, logos, graphic resources, multimedia, and any other associated elements, is the exclusive property of its developers. All rights are reserved. No element of the Application may be reproduced, distributed, modified, or used for commercial purposes without the express written authorization of the rights holders.": "Modstack, incluindo seu código-fonte, design, logos, recursos gráficos, multimídia e quaisquer outros elementos associados, é propriedade exclusiva de seus desenvolvedores. Todos os direitos são reservados. Nenhum elemento do aplicativo pode ser reproduzido, distribuído, modificado ou usado para fins comerciais sem autorização expressa por escrito dos titulares dos direitos.",
    "2. Usage Restrictions": "2. Restrições de uso",
    "The following are strictly prohibited:": "É estritamente proibido:",
    "Distributing, sharing, reselling, or sublicensing the Application or any of its components to third parties.": "Distribuir, compartilhar, revender ou sublicenciar o aplicativo ou qualquer componente a terceiros.",
    "Reproducing or redistributing resources downloaded through the Application, including images, multimedia files, configurations, and internal documents.": "Reproduzir ou redistribuir recursos baixados pelo aplicativo, incluindo imagens, arquivos multimídia, configurações e documentos internos.",
    "Modifying, altering, decompiling, reverse engineering, or attempting to access the source code of the Application in any way.": "Modificar, alterar, descompilar, fazer engenharia reversa ou tentar acessar o código-fonte do aplicativo de qualquer forma.",
    "Tampering with, bypassing, or interfering with the Application's security, verification, or authentication systems.": "Manipular, burlar ou interferir nos sistemas de segurança, verificação ou autenticação do aplicativo.",
    "Using the Application for illegal, fraudulent purposes or in any way that may cause harm to third parties.": "Usar o aplicativo para fins ilegais, fraudulentos ou de qualquer forma que possa causar danos a terceiros.",
    "3. Disclaimer of Liability": "3. Isenção de responsabilidade",
    "Modstack is provided": "O Modstack é fornecido",
    "\"as is\"": "\"como está\"",
    ", without warranties of any kind, whether express or implied. The developers are not responsible for:": ", sem garantias de qualquer tipo, expressas ou implícitas. Os desenvolvedores não são responsáveis por:",
    "Bugs, technical failures, or interruptions in the Application's operation.": "Erros, falhas técnicas ou interrupções no funcionamento do aplicativo.",
    "Loss of data, files, or configurations resulting from use of the Application.": "Perda de dados, arquivos ou configurações resultante do uso do aplicativo.",
    "Direct, indirect, incidental, or consequential damages caused by the use or inability to use the Application.": "Danos diretos, indiretos, incidentais ou consequenciais causados pelo uso ou impossibilidade de uso do aplicativo.",
    "Issues arising from third-party services, platforms, or software.": "Problemas decorrentes de serviços, plataformas ou softwares de terceiros.",
    "Incompatibilities with the operating system or other software installed on the user's device.": "Incompatibilidades com o sistema operacional ou outro software instalado no dispositivo do usuário.",
    "4. Security Warnings": "4. Avisos de segurança",
    "Modstack does not have a Windows digital signature or a verified publisher certificate. As a result, some security systems such as Windows Defender or other antivirus programs may display alerts or false positives when downloading or running the Application.": "O Modstack não possui assinatura digital do Windows nem certificado de editor verificado. Por isso, alguns sistemas de segurança como Windows Defender ou outros antivírus podem exibir alertas ou falsos positivos ao baixar ou executar o aplicativo.",
    "These warnings do not imply that the Application contains malware, viruses, or malicious code of any kind. By installing Modstack, the user acknowledges this situation and agrees to run the Application at their own risk.": "Esses avisos não significam que o aplicativo contém malware, vírus ou código malicioso de qualquer tipo. Ao instalar o Modstack, o usuário reconhece essa situação e aceita executar o aplicativo por sua própria conta e risco.",
    "5. Use at the User's Own Risk": "5. Uso por conta e risco do usuário",
    "Use of Modstack is entirely voluntary and is carried out at the user's sole responsibility. By installing the Application, the user agrees that any consequences arising from its use, whether direct or indirect, will be borne entirely by themselves, releasing the developers from any liability in that regard.": "O uso do Modstack é totalmente voluntário e ocorre sob responsabilidade exclusiva do usuário. Ao instalar o aplicativo, o usuário concorda que quaisquer consequências decorrentes de seu uso, diretas ou indiretas, serão assumidas integralmente por si mesmo, isentando os desenvolvedores de qualquer responsabilidade nesse sentido.",
    "6. Updates and Modifications to the Application": "6. Atualizações e modificações do aplicativo",
    "The developers of Modstack reserve the right to release updates, modify features, suspend the service, or discontinue the Application at any time and without prior notice, without incurring any obligation or liability toward the user.": "Os desenvolvedores do Modstack reservam-se o direito de lançar atualizações, modificar recursos, suspender o serviço ou descontinuar o aplicativo a qualquer momento e sem aviso prévio, sem assumir qualquer obrigação ou responsabilidade perante o usuário.",
    "7. Modifications to the Terms and Conditions": "7. Modificações dos termos e condições",
    "Modstack reserves the right to modify this document at any time. Changes will take effect upon publication. Continued use of the Application after changes are published implies full acceptance of the updated terms. Users are encouraged to review this document periodically.": "O Modstack reserva-se o direito de modificar este documento a qualquer momento. As alterações entram em vigor após a publicação. O uso contínuo do aplicativo após a publicação das alterações implica aceitação total dos termos atualizados. Recomendamos que os usuários revisem este documento periodicamente.",
    "8. Acceptance of Terms": "8. Aceitação dos termos",
    "Downloading, installing, or using": "Baixar, instalar ou usar",
    "constitutes full, voluntary, and unconditional acceptance of all the terms and conditions described herein. If you do not agree with any of them, you must refrain from using the Application.": "constitui aceitação total, voluntária e incondicional de todos os termos e condições descritos aqui. Se você não concordar com qualquer um deles, deve deixar de usar o aplicativo.",
    "9. Contact": "9. Contato",
    "If you have any questions about this policy, you can contact us:": "Se tiver dúvidas sobre esta política, você pode entrar em contato:",
    "Email:": "E-mail:",
    "Discord:": "Discord:",
    "Could not load default skin. Upload one to begin.": "Não foi possível carregar a skin padrão. Envie uma para começar.",
    "Loading default skin...": "Carregando skin padrão...",
    "Pose Presets": "Poses predefinidas",
    "Standing": "Em pé",
    "Walking": "Caminhando",
    "Running": "Correndo",
    "Waving": "Acenando",
    "Pointing": "Apontando",
    "Fighting": "Lutando",
    "Sitting": "Sentado",
    "Leaning": "Inclinado",
    "Arms Crossed": "Braços cruzados",
    "Dabbing": "Dabbing",
    "T-Pose": "T-Pose",
    "Victory": "Vitória",
    "Custom Poses": "Poses personalizadas",
    "Pose name": "Nome da postura",
    "Save current pose": "Salvar postura atual",
    "Export all as JSON": "Exportar tudo como JSON",
    "Import poses JSON": "Importar poses JSON",
    "No saved poses yet. Pose the model then click save.": "Ainda não há poses salvas. Posicione o modelo e clique em salvar.",
    "Delete": "Excluir",
    "Scene": "Cena",
    "Background": "Fundo",
    "None": "Nenhum",
    "Solid": "Sólido",
    "Lighting": "Iluminação",
    "Ambient": "Ambiente",
    "Light Source": "Fonte de luz",
    "Cast shadows": "Projetar sombras",
    "Camera": "Câmera",
    "Zoom": "Zoom",
    "FOV": "Campo de visão",
    "Reset Camera": "Redefinir câmera",
    "Grid Floor": "Piso da grade",
    "Show grid": "Mostrar grade",
    "Default Export Size": "Tamanho padrão de exportação",
    "Pose": "Postura",
    "L Arm": "Braço esq.",
    "R Arm": "Braço dir.",
    "Head": "Cabeça",
    "Body": "Corpo",
    "L Leg": "Perna esq.",
    "R Leg": "Perna dir.",
    "Left Arm": "Braço esquerdo",
    "Right Arm": "Braço direito",
    "Left Leg": "Perna esquerda",
    "Right Leg": "Perna direita",
    "Reset All": "Redefinir tudo",
    "Mirror": "Espelhar",
    "Reset part": "Redefinir parte",
    "Sliders are read-only while an animation is playing. Stop the animation to pose manually.": "Os controles ficam somente leitura durante uma animação. Pare a animação para posar manualmente.",
    "X (Pitch)": "X (Inclinação)",
    "Y (Yaw)": "Y (Giro)",
    "Z (Roll)": "Z (Rotação)",
    "Animation": "Animação",
    "Idle": "Parado",
    "Walk": "Andar",
    "Run": "Correr",
    "Fly": "Voar",
    "Manual pose controls are locked while animating.": "Os controles manuais de pose ficam bloqueados durante a animação.",
    "Skin & Scene": "Skin e cena",
    "Undo (Ctrl+Z)": "Desfazer (Ctrl+Z)",
    "Redo (Ctrl+Shift+Z)": "Refazer (Ctrl+Shift+Z)",
    "Reset pose": "Redefinir postura",
    "Reset camera": "Redefinir câmera",
    "Pose controls": "Controles de postura",
    "Only PNG skin files are supported.": "Somente arquivos de skin PNG são suportados.",
    "Failed to load that skin file.": "Não foi possível carregar esse arquivo de skin.",
    "Failed to reload.": "Não foi possível recarregar.",
    "Viewport not ready yet": "A visualização ainda não está pronta",
    "Detected:": "Detectado:",
    "Slim (Alex)": "Fino (Alex)",
    "Classic (Steve)": "Clássico (Steve)",
    "Clipboard copy failed.": "Falha ao copiar para a área de transferência.",
    "Clipboard write not supported here. Use Download.": "A escrita na área de transferência não é suportada aqui. Use Baixar.",
    "(PNG alpha)": "(alfa PNG)",
    "High resolutions (4K) require a capable GPU. If the canvas goes blank or the tab freezes, fall back to 1080p.": "Resoluções altas (4K) exigem uma GPU capaz. Se o canvas ficar em branco ou a aba travar, volte para 1080p.",
    "Username must be 3-16 characters: letters, numbers and _": "O nome deve ter 3-16 caracteres: letras, números e _",
    "Username must be 3–16 characters: letters, numbers and _": "O nome deve ter 3-16 caracteres: letras, números e _",
    "Failed to update username.": "Não foi possível atualizar o nome.",
    "Failed to create account.": "Não foi possível criar a conta.",
    "Network error. Try again.": "Erro de rede. Tente novamente.",
    "Network error. Please try again.": "Erro de rede. Tente novamente.",
    "Only PNG, JPEG, WEBP, or GIF files are allowed.": "Somente arquivos PNG, JPEG, WEBP ou GIF são permitidos.",
    "Max file size is 5MB.": "O tamanho máximo é 5 MB.",
    "Failed to upload avatar.": "Não foi possível enviar o avatar.",
    "Network error uploading avatar.": "Erro de rede ao enviar o avatar.",
    "Remove your avatar?": "Remover seu avatar?",
    "Failed to remove avatar.": "Não foi possível remover o avatar.",
    "Network error.": "Erro de rede.",
    "Change language": "Alterar idioma",
    "Privacy Policy for Modstack": "Política de privacidade do Modstack",
    "Terms & Conditions of Modstack": "Termos e condições do Modstack",
    "Modstack is a": "Modstack é um aplicativo",
    "application. We": ". Nós",
    "believe in transparency, allowing players to view the codebase on our official": "acreditamos em transparência, permitindo que jogadores vejam o código no nosso",
    ". You can inspect the implementation details, and see how Modstack works. This does not mean that you can create a launcher based off Modstack though": ". Você pode inspecionar os detalhes de implementação e ver como o Modstack funciona. Isso não significa que você possa criar um launcher baseado no Modstack.",
    "Resolution:": "Resolução:",
    "FPS:": "FPS:",
    "Model:": "Modelo:",
    "Modstack Studio": "Modstack Studio",
    "default": "clássico",
    "slim": "fino",
    "3–16 chars (Minecraft rules)": "3-16 caracteres (regras do Minecraft)",
    "source-available": "source-available",
    "title": "título",
    "logo": "logo",
    "skin preview": "prévia da skin",
    "More download options": "Mais opções para baixar",
    "© 2026 Modstack. All rights reserved.": "© 2026 Modstack. Todos os direitos reservados.",
    "© 2026 Modstack. All rights reserved. NOT AN OFFICIAL MINECRAFT PRODUCT.": "© 2026 Modstack. Todos os direitos reservados. NÃO É UM PRODUTO OFICIAL DO MINECRAFT.",
    "support: @fitzxel & @gekoxd": "suporte: @fitzxel & @gekoxd",
    "Modstack Launcher Preview": "Prévia do Modstack Launcher",
    " application. We believe in transparency, allowing players to view the codebase on our official": " aplicativo. Acreditamos em transparência, permitindo que jogadores vejam o código no nosso",
    "@fitzxel & @gekoxd — Support & Community Management": "@fitzxel & @gekoxd — Suporte e gestão da comunidade",
    "— Support & Community Management": "— Suporte e gestão da comunidade",
    ", you automatically agree to all the terms and conditions described in this document. If you disagree with any of them, you must uninstall the application immediately and refrain from using it.": ", você aceita automaticamente todos os termos e condições descritos neste documento. Se discordar de qualquer um deles, deve desinstalar o aplicativo imediatamente e deixar de usá-lo.",
    "← Back to home": "← Voltar ao início",
    "You can now customize the launcher's accent color.": "Agora você pode personalizar a cor de destaque do launcher.",
    "You can now set your Java installation manually without needing to install it through the launcher.": "Agora você pode configurar sua instalação do Java manualmente sem precisar instalá-la pelo launcher.",
    "You can now create groups with your friends in the chat.": "Agora você pode criar grupos com seus amigos no chat.",
    "Remember that bugs may still exist, so if you find any please report them in https://discord.gg/BWGab5AqPJ THANK YOU FOR YOUR SUPPORT!": "Lembre-se de que ainda podem existir bugs; se encontrar algum, reporte em https://discord.gg/BWGab5AqPJ. OBRIGADO PELO APOIO!",
    "Redesigned the Home and Chat interfaces.": "As interfaces Início e Chat foram redesenhadas.",
    "Added Featured Servers such as Hypixel and CubeCraft.": "Foram adicionados servidores em destaque como Hypixel e CubeCraft.",
    "Clicking on a server now checks whether you have an instance with the required Minecraft version.": "Ao clicar em um servidor, agora é verificado se você tem uma instância com a versão necessária do Minecraft.",
    "Home has been renamed to \"Dashboard\".": "Início foi renomeado para \"Dashboard\".",
    "I don't know what else to add to the changelog. There were so many changes.": "Não sei mais o que adicionar ao changelog. Foram muitas mudanças.",
    "Added support for CurseForge modpacks.": "Foi adicionado suporte a pacotes de mods do CurseForge.",
    "Redesigned the Instances and Home pages.": "As páginas de Instâncias e Início foram redesenhadas.",
    "Added filter bar to the Modpacks section": "Foi adicionada uma barra de filtros à seção de pacotes de mods",
    "Minor design changes were added": "Foram adicionadas pequenas mudanças de design",
    "We added something special a Modstack Installer that makes the installation process way easier. It's something I've always wanted to build, so if you want to try it out, you can download it from the website. Keep in mind it's Windows-only for now, and the code is Source-Available": "Adicionamos algo especial: um instalador do Modstack que torna o processo de instalação muito mais fácil. É algo que eu sempre quis criar, então, se quiser testar, você pode baixá-lo pelo site. Lembre-se de que por enquanto é apenas para Windows e o código é Source-Available.",
    "Modstack Installer: https://github.com/Modstack-Launcher/ModstackInstaller": "Instalador do Modstack: https://github.com/Modstack-Launcher/ModstackInstaller",
    "Modstack v1.1.1 Fix update": "Atualização de correções Modstack v1.1.1",
    "Added 100% launcher translation in Spanish and Portuguese (more languages coming soon)": "Foi adicionada tradução 100% do launcher em espanhol e português (mais idiomas em breve)",
    "The website received changes to support the friends system": "O site recebeu mudanças para suportar o sistema de amigos",
    "Added version filters per loader, only showing supported versions (e.g. selecting Fabric will only show versions from 1.14 onwards)": "Foram adicionados filtros de versão por loader, mostrando apenas versões compatíveis (por exemplo, ao selecionar Fabric, só aparecem versões a partir da 1.14)",
    "The launcher color scheme has been completely revamped": "O esquema de cores do launcher foi totalmente renovado",
    "Forge metadata support has been added": "Foi adicionado suporte a metadados do Forge",
    "You can now change the Bedrock background": "Agora você pode alterar o fundo do Bedrock",
    "Added playtime tracking": "Foi adicionado rastreamento de tempo de jogo",
    "Redesigned the Loading screen": "A tela de carregamento foi redesenhada",
    "And finally.. after a lot of effort we're out of Beta and welcoming the OFFICIAL STABLE version, thank you all for your amazing support to Modstack": "E finalmente... depois de muito esforço saímos do Beta e damos boas-vindas à versão OFICIAL ESTÁVEL. Obrigado a todos pelo apoio incrível ao Modstack.",
    "Added a Server Browser": "Foi adicionado um navegador de servidores",
    "Added NeoForge support and version 26.1.2": "Foi adicionado suporte ao NeoForge e à versão 26.1.2",
    "Fixed the issue where mods were not loading": "Foi corrigido o problema em que os mods não carregavam",
    "Added support for importing Modrinth (.mrpack) and CurseForge (.zip) modpacks": "Foi adicionado suporte para importar pacotes de mods do Modrinth (.mrpack) e CurseForge (.zip)",
    "Added Minecraft Bedrock support": "Foi adicionado suporte ao Minecraft Bedrock",
    "Added the ability to choose modpack versions": "Foi adicionada a opção de escolher versões de pacotes de mods",
    "Added CurseForge support": "Foi adicionado suporte ao CurseForge",
    "Added the ability to set a custom path": "Foi adicionada a opção de definir um caminho personalizado",
    "🎉 AND THE CHERRY ON TOP — THE CODE IS NOW OPEN-SOURCE!!! well... I mean it's Source-Available, not Open Source.": "🎉 E A CEREJA DO BOLO: O CÓDIGO AGORA É CÓDIGO ABERTO!!! bom... quer dizer Source-Available, não código aberto.",
    "Create your own instances to play Minecraft comfortably or install modpacks to your liking!": "Crie suas próprias instâncias para jogar Minecraft confortavelmente ou instale pacotes de mods do seu jeito.",
    "The launcher is now fully in English": "O launcher agora está totalmente em inglês",
    "Modpacks are now available": "Os pacotes de mods já estão disponíveis",
    "Thanks for all the support — this is just the beginning! For bugs or feedback join the Discord: https://discord.gg/nxsDcYVa6s": "Obrigado por todo o apoio. Isso é só o começo! Para bugs ou feedback, entre no Discord: https://discord.gg/nxsDcYVa6s",
    "The launcher now supports Fabric": "O launcher agora suporta Fabric",
  },
};

const reverseLookup = new Map<string, string>();

for (const [source, translated] of Object.entries(translations.es)) {
  reverseLookup.set(normalize(source), source);
  reverseLookup.set(normalize(translated), source);
}

for (const [source, translated] of Object.entries(translations.pt)) {
  reverseLookup.set(normalize(source), source);
  reverseLookup.set(normalize(translated), source);
}

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function normalize(value: string) {
  return value.replace(/\u2026/g, "...").replace(/\s+/g, " ").trim();
}

function translatePattern(key: string, language: Exclude<Language, "en">) {
  const skinMatch = key.match(/^Could not load skin for "(.+?)"\.?(.*)$/);
  if (skinMatch) {
    const [, name, detail] = skinMatch;
    return language === "es"
      ? `No se pudo cargar la skin de "${name}".${detail}`
      : `Não foi possível carregar a skin de "${name}".${detail}`;
  }

  const exportedMatch = key.match(/^Exported (.+) image\.$/);
  if (exportedMatch) {
    return language === "es"
      ? `Imagen ${exportedMatch[1]} exportada.`
      : `Imagem ${exportedMatch[1]} exportada.`;
  }

  const agoMatch = key.match(/^(\d+)\s+(m|h)\s+ago$/);
  if (agoMatch) {
    return language === "es"
      ? `hace ${agoMatch[1]} ${agoMatch[2]}`
      : `há ${agoMatch[1]} ${agoMatch[2]}`;
  }

  const dayMatch = key.match(/^(\d+)\s+days?\s+ago$/);
  if (dayMatch) {
    const plural = dayMatch[1] === "1" ? "" : "s";
    return language === "es"
      ? `hace ${dayMatch[1]} día${plural}`
      : `há ${dayMatch[1]} dia${plural}`;
  }

  const monthMatch = key.match(/^(\d+)\s+months?\s+ago$/);
  if (monthMatch) {
    const plural = monthMatch[1] === "1" ? "" : "es";
    return language === "es"
      ? `hace ${monthMatch[1]} mes${plural}`
      : `há ${monthMatch[1]} ${monthMatch[1] === "1" ? "mês" : "meses"}`;
  }

  const yearMatch = key.match(/^(\d+)\s+years?\s+ago$/);
  if (yearMatch) {
    const plural = yearMatch[1] === "1" ? "" : "s";
    return language === "es"
      ? `hace ${yearMatch[1]} año${plural}`
      : `há ${yearMatch[1]} ano${plural}`;
  }

  return null;
}

function translateText(value: string, language: Language) {
  const match = value.match(/^(\s*)(.*?)(\s*)$/s);
  if (!match) return value;

  const [, prefix, core, suffix] = match;
  const key = reverseLookup.get(normalize(core)) ?? normalize(core);

  if (!key) return value;
  if (language === "en") return `${prefix}${key}${suffix}`;

  return `${prefix}${translations[language][key] ?? translatePattern(key, language) ?? key}${suffix}`;
}

function translateDocument(language: Language) {
  document.documentElement.lang = language;

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"].includes(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        return normalize(node.textContent ?? "")
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    },
  );

  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }

  textNodes.forEach((node) => {
    const next = translateText(node.textContent ?? "", language);
    if (node.textContent !== next) node.textContent = next;
  });

  document.querySelectorAll<HTMLElement>("[title], [aria-label], [alt], [placeholder]").forEach((el) => {
    ["title", "aria-label", "alt", "placeholder"].forEach((attribute) => {
      const current = el.getAttribute(attribute);
      if (current) el.setAttribute(attribute, translateText(current, language));
    });
  });
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = window.localStorage.getItem("modstack-language");
    return saved === "es" || saved === "pt" || saved === "en" ? saved : "en";
  });
  const applyingRef = useRef(false);

  const setLanguage = (nextLanguage: Language) => {
    window.localStorage.setItem("modstack-language", nextLanguage);
    setLanguageState(nextLanguage);
  };

  useEffect(() => {
    const runTranslation = () => {
      applyingRef.current = true;
      translateDocument(language);
      window.setTimeout(() => {
        applyingRef.current = false;
      }, 0);
    };

    runTranslation();

    const observer = new MutationObserver(() => {
      if (applyingRef.current) return;
      window.requestAnimationFrame(runTranslation);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["title", "placeholder", "alt", "aria-label"],
    });

    return () => observer.disconnect();
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
      <LanguageSwitcher />
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div className="language-switcher" ref={ref}>
      <button
        type="button"
        className="language-switcher__button"
        aria-label="Change language"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Globe2 size={16} />
        <span>{languages[language].short}</span>
        <ChevronDown size={14} className={open ? "language-switcher__chevron open" : "language-switcher__chevron"} />
      </button>

      {open && (
        <div className="language-switcher__menu" role="menu">
          {(Object.keys(languages) as Language[]).map((item) => (
            <button
              key={item}
              type="button"
              className={item === language ? "active" : ""}
              onClick={() => {
                setLanguage(item);
                setOpen(false);
              }}
            >
              <span>{languages[item].label}</span>
              <span>{languages[item].short}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
