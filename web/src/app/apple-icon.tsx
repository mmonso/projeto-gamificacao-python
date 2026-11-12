// Ícone da tela de início no iPhone (Adicionar à Tela de Início).
import { ImageResponse } from "next/og";
import { desenhoDoIcone } from "./icones/desenho";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function IconeApple() {
  return new ImageResponse(desenhoDoIcone(180), size);
}
