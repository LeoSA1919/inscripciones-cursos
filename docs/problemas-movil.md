# Revisión del diseño en móvil

Responsable: Josué
Para: Gabriela (estilos.css)

## Cómo se revisó

Se cargaron `/`, `/registro` y `/lista` en Chrome dentro de un marco de **375 px** de ancho
(teléfono común) y también de **320 px** (teléfonos pequeños, como el iPhone SE de primera
generación). En cada página se midió si algún elemento se sale del ancho de la pantalla, el ancho
de campos y botones y el tamaño de los enlaces del menú. En `/registro` también se revisó el
formulario con los 5 mensajes de error visibles. Había 2 inscripciones guardadas.

No se modificó `estilos.css`.

## Resumen

| Página | 375 px | 320 px |
|---|---|---|
| `/` | Sin problemas | Sin problemas |
| `/registro` | Sin problemas | Sin problemas |
| `/lista` | Sin problemas | Correo cortado a mitad de palabra (problema 1) |
| Menú (todas) | Enlaces pequeños para tocar (problema 2) | Igual |

En ningún ancho hay **desborde horizontal**: el ancho del contenido es igual al de la pantalla en
las tres páginas y ningún elemento sale del borde. El menú se apila bien (título arriba y enlaces
debajo), los campos y el botón del formulario ocupan todo el ancho disponible y las tarjetas de la
lista se muestran en una sola columna.

## Problemas encontrados

### 1. El correo se corta a mitad de palabra en las tarjetas

- **Página:** `/lista`
- **Ancho:** 320 px. También pasa en escritorio (~1570 px), donde cada tarjeta mide unos 230 px.
  A 375 px los correos de prueba sí caben en una línea.
- **Qué se ve mal:** el correo se parte en cualquier letra, por ejemplo `ana.perez@corre` / `o.com`
  y `luis.gomez@corre` / `o.com`. Se lee raro y parece otro correo.
- **Causa probable:** `.tarjeta` usa `overflow-wrap: anywhere` (línea 215 de `estilos.css`). Evita
  que el texto se salga, pero permite cortar en cualquier letra.
- **Gravedad:** baja. No se pierde información ni hay desborde.
- **Capturas:** [capturas/movil/320-lista.png](capturas/movil/320-lista.png),
  [capturas/07-consulta-lista.jpg](capturas/07-consulta-lista.jpg) (escritorio)

### 2. Los enlaces del menú son pequeños para tocarlos con el dedo

- **Página:** todas (menú superior)
- **Ancho:** 375 px y 320 px
- **Qué se ve mal:** el área que se puede tocar de cada enlace mide 24 px de alto ("Inicio" 41×24,
  "Registrar" 74×24, "Lista" 35×24). Las guías de accesibilidad recomiendan al menos 44×44 px en
  pantallas táctiles, así que es fácil tocar el enlace de al lado o no atinar.
- **Gravedad:** baja. El menú se puede usar, pero es incómodo.
- **Captura:** [capturas/movil/375-registro.png](capturas/movil/375-registro.png)

## Capturas a 375 px

- Inicio: [capturas/movil/375-inicio.jpg](capturas/movil/375-inicio.jpg)
- Registro: [capturas/movil/375-registro.png](capturas/movil/375-registro.png)
- Lista: [capturas/movil/375-lista.png](capturas/movil/375-lista.png)
