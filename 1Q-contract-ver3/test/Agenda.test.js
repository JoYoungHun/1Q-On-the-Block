const Agenda = artifacts.require("Agenda");

contract('Agenda', function([deployer, user1, user2]) { 
    beforeEach(async () => {
        agenda = await Agenda.new("Title", "AgendaType", 123456, 789012);
        
    });

    describe('modifyInfo', function () {
        it('modify success', async () => {
            let receipt = await agenda.modifyInfo('New Title', 'New AgendaType', 1000000, 2000000, {from : deployer});

            console.log(await agenda.getInfo());
        })
    })

    describe('generate rand', function () {
        it('get rand info' ,async () => {
            console.log(await agenda.getRandInfo())
        })

        it.only('draw', async () => {

            await agenda.setBlockInfo({from : deployer})

            await agenda.draw(1,{from : deployer})

            // console.log(await agenda.getWinNum());

            // console.log(await agenda.getWinners());

            console.log(await agenda.getRandInfo())
        })

    })
});