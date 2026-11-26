import {readings} from './demo-data.js';

export async function api(path,body){
  if(path==='/api/config'&&body===undefined)return {demoOnly:true};
  if(path==='/api/demo'&&body===undefined){
    return {readings:readings.map(({profileId,label,pillars})=>({profileId,label,dayPillar:pillars.day}))};
  }
  if(path==='/api/demo/start'){
    const reading=readings.find(({profileId})=>profileId===body?.profileId);
    if(reading)return {reading};
    throw Error('입장 양식에서 출생 정보를 선택해 주세요.');
  }
  throw Error('이 기능은 테스트 버전에서 사용할 수 없습니다.');
}
