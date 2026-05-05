const CYRILLIC: Record<string, string> = {
  а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'j',
  к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',
  х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya',
};

const ARMENIAN: Record<string, string> = {
  ա:'a',բ:'b',գ:'g',դ:'d',ե:'e',զ:'z',է:'e',ը:'e',թ:'t',ժ:'zh',ի:'i',
  լ:'l',խ:'kh',ծ:'ts',կ:'k',հ:'h',ձ:'dz',ղ:'gh',ճ:'ch',մ:'m',յ:'y',
  ն:'n',շ:'sh',ո:'vo',չ:'ch',պ:'p',ջ:'j',ռ:'r',ս:'s',վ:'v',տ:'t',
  ր:'r',ց:'ts',փ:'p',ք:'k',և:'yev',օ:'o',ֆ:'f',
};

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .split('')
    .map((ch) => CYRILLIC[ch] ?? ARMENIAN[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
