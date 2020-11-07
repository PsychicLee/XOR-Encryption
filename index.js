const inquirer = require("inquirer");

// const str = "你好，Hello Word ~"
// const key = "sdgasij;'/.,/`./1.3.4=-=fdAAF:?<>#<>$"

/**
 * 将一位字符转换为二进制表示的 16 位 Unicode 编码
 * @param {String} char 一位字符
 * @return {String} 16 位的二进制字符串
 */
const toUnicodeStr = (char) => {
  let str = "";
  str = char.charCodeAt().toString(2);
  while (str.length < 16) {
    str = '0' + str;
  }

  return str;
}

/**
 * 将二进制的 Unicode 编码转换为原来的字符
 * @param {String} str 16 位 unicode 编码（二进制）
 * @return {String} 明文字符
 */
const toChar = (str) => {
  let unicode = parseInt(str, 2); // 十进制的编码
  return String.fromCharCode(unicode);
}

/**
 * 将明文和密钥进行按位异或
 * @param {String} text 二进制明文或密文
 * @param {String} key 二进制密钥
 * @return {String} 加密后的二进制密文
 */
const bitwiseXOR = (text, key) => {
  const
    textArr = text.split(""),
    keyArr = key.split("");
  let ciphertextArr = [];
  for (let i = 0, len = textArr.length; i < len; i++) {
    let i_key = i % keyArr.length;
    let result = parseInt(textArr[i]) ^ parseInt(keyArr[i_key]);
    ciphertextArr.push(result);
  }
  let ciphertext = ciphertextArr.join("");

  return ciphertext;
}

let plaintext_binary = "";  // 二进制明文
let key_binary = "";  // 二进制密钥
let ciphertext_binary = ""; // 二进制密文

/**
 * 加密过程
 * @param {String} plaintext 明文字符串
 * @param {String} key 密钥字符串
 * @return {String} 每位数为一个十六进制数的密文
 */
const encrypt = (plaintext, key) => {
  // 将明文和密钥都转换为二进制
  const
    plaintextArr = plaintext.split(""),
    keyArr = key.split("");
  plaintextArr.forEach(char => {
    plaintext_binary = plaintext_binary + toUnicodeStr(char);
  });
  key_binary = "";
  keyArr.forEach(char => {
    key_binary = key_binary + toUnicodeStr(char);
  });

  ciphertext_binary = bitwiseXOR(plaintext_binary, key_binary);

  // 为了方便表示（减小长度），每 4 位表示为一位十六进制数
  let ciphertext_sexadecimal = "";
  for (let i = 0, len = ciphertext_binary.length; i < len; i += 4) {
    let str = parseInt(ciphertext_binary.slice(i, i + 4), 2).toString(16);
    ciphertext_sexadecimal = ciphertext_sexadecimal + str;
  }

  return ciphertext_sexadecimal;
}

/**
 * 解密过程
 * @param {String} ciphertextStr 密文字符串
 * @param {String} key 密钥字符串
 * @return {String} 明文
 */
const decrypt = (ciphertextStr, key) => {
  // 将密文变成二进制表示
  let ciphertext_binary = ""
  ciphertextStr.split("").forEach(char => {
    let str = parseInt(char, 16).toString(2);
    while (str.length < 4) {
      str = "0" + str;
    }
    ciphertext_binary = ciphertext_binary + str;
  });

  // 密钥转换为二进制形式
  key_binary = "";
  key.split("").forEach(char => {
    key_binary = key_binary + toUnicodeStr(char);
  });

  // 二进制密文转换为二进制明文
  plaintext_binary = bitwiseXOR(ciphertext_binary, key_binary);

  // 二进制明文转换为字符
  let plaintext = "";
  for (let i = 0, len = plaintext_binary.length; i < len; i += 16) {
    const unicode = parseInt(plaintext_binary.slice(i, i + 16), 2);
    plaintext = plaintext + String.fromCharCode(unicode);
  }

  return plaintext;
}

// encrypt(str, key);
// decrypt("4f135919ff6b00290016000500060054000700780041005e004b00400050", key)

const promptList = [{
  type: 'input',
  message: '请输入明文/密文:',
  name: 'plaintext'
}, {
  type: 'input',
  message: '请输入密钥:',
  name: 'key'
}, {
  type: 'list',
  message: '请选择您要进行的操作:',
  name: 'operation',
  choices: [
    "加密",
    "解密"
  ]
}];

inquirer.prompt(promptList).then(answers => {
  if (answers['operation'] == "加密") {
    console.log("您的密文为:", encrypt(answers.plaintext, answers.key));
  } else {
    console.log("您的明文为:", decrypt(answers.plaintext, answers.key));
  }
})