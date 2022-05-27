import visa from "../assets/cards/visa.png";
import americanexpress from "../assets/cards/americanexpress.png";
import dinersclub from "../assets/cards/dinersclub.jpg";
import discover from "../assets/cards/discover.jpg";
import elo from "../assets/cards/elo.png";
import hiper from "../assets/cards/hiper.png";
import jcb from "../assets/cards/jcb.png";
import mastercard from "../assets/cards/mastercard.png";
import mir from "../assets/cards/mir.png";
import unionpay from "../assets/cards/unionpay.png";

export function getCardImage(type) {
  switch (type) {
    case "visa":
      return visa;
    case "mastercard":
      return mastercard;
    case "amex":
      return americanexpress;
    case "diners club":
      return dinersclub;
    case "discover":
      return discover;
    case "jcb":
      return jcb;
    case "unionpay":
      return unionpay;
    case "maestro":
      return mastercard;
    case "mir":
      return mir;
    case "elo":
      return elo;
    case "hiper":
      return hiper;
    case "hipercard":
      return hiper;
    default:
      return visa;
  }
}
