pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Abab.sol";

contract TestAbabSchedule {
  function testUpsertSchedule_InsertUpdateLogic() {
    Abab abab = Abab(DeployedAddresses.Abab());

    Assert.equal( abab.GetSchedulesLength(0), 0, "don't catch if room not exists");

    abab.UpsertRoomFromHost(0,0,0,0,0,0);// create room

    Assert.equal( abab.GetSchedulesLength(0), 0, "check length for new room");

    //first insert
    abab.UpsertSchedule(0, 777, 111, 222, 333, 444, 555, 0);

    Assert.equal( abab.GetSchedulesLength(0), 1, "after first insert Schedules");

    var (from0,to0,dayPrice0,weekPrice0,monthPrice0) = abab.GetMyScheduleByIndex(0, 0);
    Assert.equal( from0       , 111, "check first insert");
    Assert.equal( to0         , 222, "check first insert");
    Assert.equal( dayPrice0   , 333, "check first insert");
    Assert.equal( weekPrice0  , 444, "check first insert");
    Assert.equal( monthPrice0 , 555, "check first insert");

    //second insert
    abab.UpsertSchedule(0, 777, 666, 777, 888, 999, 123, 0);

    Assert.equal( abab.GetSchedulesLength(0), 2, "after second insert Schedules");

    var (from1,to1,dayPrice1,weekPrice1,monthPrice1) = abab.GetMyScheduleByIndex(0, 1);
    Assert.equal( from1       , 666, "check second insert");
    Assert.equal( to1         , 777, "check second insert");
    Assert.equal( dayPrice1   , 888, "check second insert");
    Assert.equal( weekPrice1  , 999, "check second insert");
    Assert.equal( monthPrice1 , 123, "check second insert");

    //first update
    abab.UpsertSchedule(0, 0, 112, 234, 345, 456, 567, 0);

    Assert.equal( abab.GetSchedulesLength(0), 2, "after first update Schedules");

    (from0,to0,dayPrice0,weekPrice0,monthPrice0) = abab.GetMyScheduleByIndex(0, 0);
    Assert.equal( from0       , 112, "check first update");
    Assert.equal( to0         , 234, "check first update");
    Assert.equal( dayPrice0   , 345, "check first update");
    Assert.equal( weekPrice0  , 456, "check first update");
    Assert.equal( monthPrice0 , 567, "check first update");

    (from1,to1,dayPrice1,weekPrice1,monthPrice1) = abab.GetMyScheduleByIndex(0, 1);
    Assert.equal( from1       , 666, "check first update");
    Assert.equal( to1         , 777, "check first update");
    Assert.equal( dayPrice1   , 888, "check first update");
    Assert.equal( weekPrice1  , 999, "check first update");
    Assert.equal( monthPrice1 , 123, "check first update");
  }

  function testRemoveSchedule() {
    Abab abab = Abab(DeployedAddresses.Abab());

    abab.UpsertRoomFromHost(0,0,0,0,0,0);

    while(abab.GetSchedulesLength(0)>0)
      abab.RemoveSchedule(0, abab.GetSchedulesLength(0)-1);

    for(uint i = 0;i<10;++i)
      abab.UpsertSchedule(0, i, i, i, i, i, i, 0);

    abab.RemoveSchedule(0, 0);
    abab.RemoveSchedule(0, 4);
    abab.RemoveSchedule(0, 9);

    var (from,to,dayPrice,weekPrice,monthPrice) = abab.GetMyScheduleByIndex(0, 0);
    Assert.equal( from , 1, "0");
    
    (from,to,dayPrice,weekPrice,monthPrice) = abab.GetMyScheduleByIndex(0, 2);
    Assert.equal( from , 3, "2");

    (from,to,dayPrice,weekPrice,monthPrice) = abab.GetMyScheduleByIndex(0, 3);
    Assert.equal( from , 4, "3");
    
    (from,to,dayPrice,weekPrice,monthPrice) = abab.GetMyScheduleByIndex(0, 6);
    Assert.equal( from , 8, "6");
  }

  function testSaveScheduleAfterRoomUpdate() {
    Abab abab = Abab(DeployedAddresses.Abab());

    abab.UpsertRoomFromHost(0,0,0,0,0,0);

    while(abab.GetSchedulesLength(0)>0)
      abab.RemoveSchedule(0, abab.GetSchedulesLength(0)-1);

    abab.UpsertSchedule(0, 111, 111, 111, 111, 111, 111, 0);
    abab.UpsertSchedule(0, 222, 222, 222, 222, 222, 222, 0);
    
    Assert.equal( abab.GetSchedulesLength(0) , 2, "check length before update room");
    abab.UpsertRoomFromHost(0,0,0,0,0,0);
    Assert.equal( abab.GetSchedulesLength(0) , 2, "check length after update room");
  }
}