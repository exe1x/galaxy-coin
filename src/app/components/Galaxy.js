// src/app/components/Galaxy.js
"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

// Static array of holders provided by the user
const staticHolders = [
    {
        "holder": "FBR1i8TqXGDnVcVrjP7MGeARNbLw4YiUf8fJpWQd7kZi",
        "amount": 2892700291790
    },
    {
        "holder": "DaJiV9P4BJ9hLsW37vDsNZEShJpfQyNNBt45ar6ZWQpR",
        "amount": 755417
    },
    {
        "holder": "84LS68S3jVkRPLQ6wzsE4nfsnpcXvqVekUXfvofFx98e",
        "amount": 947452853967
    },
    {
        "holder": "62DyYKPFZfN4GxRuNDLYEwFUGpw6k8qSX7PB1EEyhcbB",
        "amount": 157254076420
    },
    {
        "holder": "4vM6rMv6ev9gmyqsKnP3uFLq56Sg5pdebBMELFjg5Ev7",
        "amount": 3401129472260
    },
    {
        "holder": "2D5hRU1K5iV9GKuoEeg9KgrX3bN5NrhizXQLzzKeSeib",
        "amount": 9475346504316
    },
    {
        "holder": "7mwmagdYShEgbtYpDfDaH6bBZJyNq1s98eAL4ztn67Hn",
        "amount": 900642689800
    },
    {
        "holder": "CSfpdVYt5VxEoobPbq3Cc1gMLBprXA9EQbkwbbW9w4Ls",
        "amount": 61577402052
    },
    {
        "holder": "BteP6A9uFSgzVvnmPzjYaB96QTNtBWmnQneyDStdShuw",
        "amount": 86163920188
    },
    {
        "holder": "2j3MGgjTZnf5woD1dV9XScaSy5SxPeKh5eTTzcpZ142z",
        "amount": 71583699
    },
    {
        "holder": "7SyS77wm8udx5DrsYpWSwY2vkdgLJ8QZFbPpUFA4n6vM",
        "amount": 6426495842652
    },
    {
        "holder": "GP2r87GbG8V1ocaRr9rBEkfQQnt1bpLWxBoJeh7PqZyr",
        "amount": 679001217105
    },
    {
        "holder": "2YGKN2BQmdA6jM3YLU2MtCp89sZW5t4UPWwfirxSLmfK",
        "amount": 1073548816238
    },
    {
        "holder": "6f5qXikBhjWfKsb5Cpf3ah9pQBGbpfSDhW3xwV2kssWh",
        "amount": 175297873154
    },
    {
        "holder": "263mqKkY22VVW3aZQeb8HM9N6hcnnf1a8jazLyAcLHC1",
        "amount": 974655105516
    },
    {
        "holder": "3SRqbBPa8HtWwBEC1gBuYKinhr5h2xA9RJ2R3k5zEEQs",
        "amount": 770695394250
    },
    {
        "holder": "EE66qGYRA9WkJde6JqxU3MRKKFCN5gam3VSySCKGsbYp",
        "amount": 622596577084
    },
    {
        "holder": "n88qWT6ZU2wNE5nKeZ9yX29CuVVmpDrzdKtqRfCFL59",
        "amount": 59827620008
    },
    {
        "holder": "FWtifCvKjA8EB2MVn87krhpEQrPmASQLzbnnuNTek6A1",
        "amount": 2093068114698
    },
    {
        "holder": "A5uvz1gPu9z6Kt1LvnNPM84mEk9SAZnnfcbHUsB1pkbb",
        "amount": 743077786354
    },
    {
        "holder": "7ii89VpfCF6gUvzU78vzMLenseVCw8Qkr9NYyKaA9QyS",
        "amount": 34723724785
    },
    {
        "holder": "2BqCAb39Ka2yCMyB7W7pY7E1taPEHbk78Hy6u4nLR9o1",
        "amount": 186405692262
    },
    {
        "holder": "JNPTnfJyGr1gZNrJiuMcNDrmste9h39RGrUjykfCpyX",
        "amount": 9144457346864
    },
    {
        "holder": "8vK8AYFYCRbPgFSDHHTNJ14A3dHXM78MoTVofs1p9hzj",
        "amount": 173839070218
    },
    {
        "holder": "2e7Dby7aURe7jdquJJSX6pJgR6JqqepzqpueU5Ys9cQp",
        "amount": 251721642357
    },
    {
        "holder": "AtZZv82cXdyaZNqfr3QJgiVvM1FqZSqLm1N4K5WWkyP4",
        "amount": 186769228485
    },
    {
        "holder": "GncRWiCzB9FihBFVwkNdyKr9ntqobf7UaXCZowgpwceC",
        "amount": 426242198707
    },
    {
        "holder": "7GFiijXyHDmXfEpuu8Rjy2WtxcyPTrf714dbLemM4ZeG",
        "amount": 2418722123882
    },
    {
        "holder": "B9yBoSadt3WUcXyTfUa3qKTYxpzzPMLuyBBkhAUt5hAG",
        "amount": 179519702455
    },
    {
        "holder": "6AboZSc8c4C1kANLyKBQdhrkXnrS1Cwzom7r7P2gZAEJ",
        "amount": 24108483898
    },
    {
        "holder": "821owggrYXcq8tU7E2td8Kruvt1PE3a79tdD4uW39uvN",
        "amount": 206509654800
    },
    {
        "holder": "6PXyJ6aLn7GoywUq5atgh2rZv7W7aF8nFookZ4UBrKH7",
        "amount": 9155368689493
    },
    {
        "holder": "7q6QM5kgpcYfgZ33QcdPE2vULBb1VRca4weFx8m6JpZJ",
        "amount": 312143345930
    },
    {
        "holder": "4aHSMrZ1r8gGbXwGSzMk3ty5njqS1zRuSm7kAa4scN2x",
        "amount": 148582520907
    },
    {
        "holder": "D6xffW8wnJtitQrH5N3iZbei7TRp9iW9RDa1x5Xcbw8h",
        "amount": 6074145403137
    },
    {
        "holder": "3yhYA61Kn62Ahv9LuDMgERUDntbqFafZ7BMxJCXh8GDD",
        "amount": 1459526545306
    },
    {
        "holder": "G5j7qz7wRyPi4cWqy4piGHWdsJDuoFEinfjL4ogZMGdr",
        "amount": 14785282548
    },
    {
        "holder": "8ioFaUwfcvxF4Mq81FSY825kirDS5RkV96ENkuWzSsnf",
        "amount": 10433845297544
    },
    {
        "holder": "2MEhfR6Q332avNoJhuXY2x3aecrfNVb7ziLARXX1HShU",
        "amount": 419995228523
    },
    {
        "holder": "K2Z2HxMSLG6NKwyZbr47yH22wFoLYyLFWHpFM7La3sn",
        "amount": 56836665269
    },
    {
        "holder": "6TEwWeD2sT5eho6rqyzkKzkhgF1yrCRTMvXtmQUnGjHm",
        "amount": 11662283423
    },
    {
        "holder": "AMKdv8gHAENZByJdMYtz55jiKANEWpEpVzcVa6dzThFF",
        "amount": 398121046900
    },
    {
        "holder": "3xqUaVuAWsppb8yaSPJ2hvdvfjteMq2EbdCc3CLguaTE",
        "amount": 7175466443317
    },
    {
        "holder": "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        "amount": 351382642613369
    },
    {
        "holder": "53p7baAxExUMGcs9MZo2x3KCrWSzDpCx2oWuXMRbRCu8",
        "amount": 502675895967
    },
    {
        "holder": "Gsm9KPK7edYb5RX2dW4JjGHqkbbTm6nhQEvCDqaw8cq3",
        "amount": 3677914986776
    },
    {
        "holder": "CHgc7ipaf5ph2SZh2y1aSpxnjZ9Pz3ZAPwHJxx2DqFVd",
        "amount": 187031993864
    },
    {
        "holder": "Fa9qU4FUpvg8xJQP8Swz8oBdTqo3HVN39pTedVrbDKUA",
        "amount": 1346394693939
    },
    {
        "holder": "B1PTM3zqm9wVZDoUtKMUDzZAnLrcwGMYWGiRAdQJmF2H",
        "amount": 8268009522234
    },
    {
        "holder": "91P48eJ6WaPc4h76sqQsh2VL5jGzf7jK2iFZvMLHstgT",
        "amount": 1503889169782
    },
    {
        "holder": "3aw7HtUzRUPrjW1DcViyFTZQyhyLGwu5Wm3eZTd8PjaE",
        "amount": 18851142921
    },
    {
        "holder": "CajvdUbH6guetjHLwRYvBUUDY5qZ2ZpSH5TDwCJctmdE",
        "amount": 3699851074403
    },
    {
        "holder": "F5QHcqE7B8Br6GCGjWKuCMy1zmJnhhgNztAkeZWvuziS",
        "amount": 1289991198556
    },
    {
        "holder": "AYyy4sVUmsk3jLnEhadzrXNdnptx3jeLM7L6Mop1jsNn",
        "amount": 747821126309
    },
    {
        "holder": "9ZiyXgb4MHyiitYpPj4kyfuJRonJvYHsrDHvN7HMBDCy",
        "amount": 15733966065914
    },
    {
        "holder": "DmBms7vAzm3e1TejHegHZ4BZ241vpMPAmvd1kwFFRWMr",
        "amount": 6558697815499
    },
    {
        "holder": "7dXi6isCFXqH93wUXdqTzuXXnEfPKNhd68ixJXrmrM53",
        "amount": 16870896112264
    },
    {
        "holder": "9V9CkCuD7XFecH6eHQtm7mGxdko8fbS2CLNtzRNQV8kj",
        "amount": 26443479869054
    },
    {
        "holder": "EQJChkmUhk6dATsF5wScVoBs5cVFAa2trLWAYPc1nvhR",
        "amount": 11656434898
    },
    {
        "holder": "6ETmk1Db2CAwZYDn7cqsiougSLhzCH2KiUtueNLvUtoK",
        "amount": 1646929318378
    },
    {
        "holder": "8AjrUMoyjCiB6pzDJYDgmXWBhJfCVSdKy9cxFL42Uw7a",
        "amount": 29723986758260
    },
    {
        "holder": "5NvEm5b3g5pucxYDmfof9UAck8dd1gNBKKP6fTa8XxsW",
        "amount": 19937024319
    },
    {
        "holder": "721e58dSM2qQuy3G3YQqQhRjBTH3SgVoTnxUFDis4RAf",
        "amount": 191887691692
    },
    {
        "holder": "ES47EKqre12mruop1WDiTgP1LyNmnqZjJoVKGZ5s3o1r",
        "amount": 27039362553
    },
    {
        "holder": "9pEuaNmbQn8Mw1GYsreqpAz7Uc9MM9PUF1wGCSsY89tZ",
        "amount": 5246742796
    },
    {
        "holder": "HGrYmcXeRbiHWNpvRN8Vep25K14dogTPBbWHDKZ3rzFS",
        "amount": 18241711750742
    },
    {
        "holder": "5iywveQKkidqPDKt2CExJcWKex2EXz9kbGcYiZvhuXWs",
        "amount": 1846702418
    },
    {
        "holder": "8puRdmNveNxDjnx96htrwCGbB1gyKJFS3JZpKYzsEKR3",
        "amount": 418205122337
    },
    {
        "holder": "2WVYqM5MifBVWw34QfMBiF5axBSgJyv36336UEfBFRN4",
        "amount": 41742757005
    },
    {
        "holder": "DTdHa4auX68jFtXv9wkzMYCahg295AnRuwvm6moW6meZ",
        "amount": 5101051171259
    },
    {
        "holder": "ZMXpyBGTusTUnEh3CenxgiLjytinHwQv8wCnqRrih46",
        "amount": 91279509390
    },
    {
        "holder": "8g2UEjCqCdEj6pDAJVdP8xLC1AzPWEF7Ti797fBt4Ecq",
        "amount": 610848
    },
    {
        "holder": "Ba8sECNaHPHQmifcbYa7qYhKb1S8zZDfEaEcuM2MD6NZ",
        "amount": 833379046892
    },
    {
        "holder": "CsZu3wM5uxCj85fznXbJ6pmDgLdN6He6v3sV5Jt4MmGC",
        "amount": 2189793812856
    },
    {
        "holder": "86AfF1oD7QdEackcjyEMyRHgqGY693qpKHYxsysWU8za",
        "amount": 9231928266371
    },
    {
        "holder": "BbQDCm7LEf528sePxTyw8TD2ojnk1SfZ9D7AAZHeGwRw",
        "amount": 198428226135
    },
    {
        "holder": "testSUYhmhRaDQjzKzJPUPNCwfkdmLVdnxatjK2nAX2",
        "amount": 438764843
    },
    {
        "holder": "2SragRYNqHGQvctD2y5peD9XE28Q4obf5may9Ku4nQ7a",
        "amount": 225681338240
    },
    {
        "holder": "BU4QSFapxbxJB4NCHH6M5DZrLbwJDdTuqoTQMXg4wUEJ",
        "amount": 74903765572
    },
    {
        "holder": "6fTDfQra5KQKcE4JfuCF6knAEkL4sLf8UBNVatEWK8T9",
        "amount": 26556871745317
    },
    {
        "holder": "GDiQpTJnB8Jgyk3nEKursxgWWJMPMAuXtY4L3SR92fEU",
        "amount": 250909998594
    },
    {
        "holder": "HPJn6ie923VXr7jmQLisRhdTpBRFbeZR6xcccjTCFxVM",
        "amount": 360171204944
    },
    {
        "holder": "ZG98FUCjb8mJ824Gbs6RsgVmr1FhXb2oNiJHa2dwmPd",
        "amount": 1062469021156
    },
    {
        "holder": "4jNVCXPAju7SuFsxVyFAyHh4cJRruAYM4XFMkjbjnLVi",
        "amount": 14580008537617
    },
    {
        "holder": "2PCHtys3BUgowehanKrWTqrrSZn94sEsqb32LPoKH5DJ",
        "amount": 7125709901049
    },
    {
        "holder": "5wL2cPNFJeRCykjpQaXxPHspyRi9SE37jYvmRhEbXYGH",
        "amount": 670454936743
    },
    {
        "holder": "TWMfGxiscnZCnqqcyaKJyCsVQ8wCnJpx2C1igks8QLo",
        "amount": 1818717993051
    },
    {
        "holder": "E89ckooY6jCed5gJhvg8Mymbfex9B88vZxn2m3w1q8X5",
        "amount": 6908137122591
    },
    {
        "holder": "BeNtGaZpbuJ7Pix1bZ4LT8H7Xn1xTdEUpEmdrYGc7Pj",
        "amount": 7128568884740
    },
    {
        "holder": "BXiiZaJrLA2dwBaPCHrmc7AZvFTKuJm4KEa8vLc9LQzA",
        "amount": 120238425646
    },
    {
        "holder": "4tfa3CBWubyb2VrXdgE3g4xUSr2cTEF6UdyoHdMbdnH4",
        "amount": 132541881448
    },
    {
        "holder": "N9mkujv7th2AM7KWHe6H8WCwbjg7ioKvv7MRJQaoDyC",
        "amount": 431417409313
    },
    {
        "holder": "Hwaf27WEUjszFpVpmW7JSgVVATBeNbhsm4fh5w9MRh4c",
        "amount": 210429293426
    },
    {
        "holder": "6hJD5vFVsMSVKfJ3kMzUnyvUzZzLaDV3NzQ4zS8XWSwr",
        "amount": 2209862137683
    },
    {
        "holder": "73LnJ7G9ffBDjEBGgJDdgvLUhD5APLonKrNiHsKDCw5B",
        "amount": 35647519623403
    },
    {
        "holder": "9t19PKmNFQ1zhL7S5ivzzv8qu3yTy2LKV1Usn1iGYheV",
        "amount": 376489306653
    },
    {
        "holder": "J293YU5D4ra3EEb9kRqXEV5Tbo31Vurk4r1c3vnbCdVq",
        "amount": 816817676598
    },
    {
        "holder": "5peWkcduHY1tUJMcsEpwtRF53N4u67wFoc8rzxqBeYqu",
        "amount": 600401898150
    },
    {
        "holder": "Bi2g8yJV54Wr6AsKED65mXd4Ndaybcrn2oMHAGjN6b5V",
        "amount": 56114701596
    },
    {
        "holder": "8t9689dJARb1pjh9XPiqfbyachJ4ZZf9aThjNYYocjkY",
        "amount": 46490997370
    },
    {
        "holder": "9KPoasoyczRUifkGFYZ4wpQU6srCFXpFj3VdEJRArAvP",
        "amount": 237074267371
    },
    {
        "holder": "EGWm8j6Eqdj8KP8GTRUTx9yRWZ5s3QJiAdCT8eK5fsSz",
        "amount": 137972912860
    },
    {
        "holder": "5U9D8kRZa8pqDWH88KeWTfdMoCATE8EEDGC2PkKVzKu4",
        "amount": 140734800660
    },
    {
        "holder": "G7htNYJqJhppm1Ra3sHcPP93ApAvVFimbunTuq8hqjba",
        "amount": 21727652562
    },
    {
        "holder": "DQeJQ91Uzcuyk4iAtpQ9FwD8Ddwr62NeWd8hoE1kgLLs",
        "amount": 304327717
    },
    {
        "holder": "4oJNicmBbq1ZtmBgWD39kMSBKA5U1DjFJARsb3JVFL6d",
        "amount": 270260322228
    },
    {
        "holder": "2UW3vTvbbq81KqDKvdMB3TKDVnMteufbUNFidnGDWwNe",
        "amount": 475043471486
    },
    {
        "holder": "5vhD7tAA98EEE9VPrkrzhx5wUvgrCADW9jpD1rS18XTD",
        "amount": 791986932991
    },
    {
        "holder": "FgXG98pwXuJfYZcG43YsWU5Z4ZcxeEz155xFnkxvC9F5",
        "amount": 1588428248360
    },
    {
        "holder": "GR8EdCmgNUwgyERBwbWNohh8mKpcZ2PnR9xkp1jZwPzA",
        "amount": 25405192527770
    },
    {
        "holder": "8ko56cCecMos8xFxbk1x8R7zDCSM48WrdukNkL2sUw1b",
        "amount": 3341195308196
    },
    {
        "holder": "4awYxib7AoJPoCMhc9JzaCENHyLS7kn2MvyaNGBVFbh9",
        "amount": 6997370054
    },
    {
        "holder": "8tfLwxvfiWFTJp6VzPFLx7ZGEQMMiu21JoEWX3QZDiS7",
        "amount": 379868989309
    },
    {
        "holder": "8jxn21d9zbGjweoQJwnMhe5z4n8XfN4hxPrxuAjekP6D",
        "amount": 436077283789
    },
    {
        "holder": "45ruCyfdRkWpRNGEqWzjCiXRHkZs8WXCLQ67Pnpye7Hp",
        "amount": 1012156015
    },
    {
        "holder": "FFX85tQuKZmujf3fTxWJr4h679hbTHVpnKXpbvBktWiU",
        "amount": 3867623916473
    },
    {
        "holder": "E9DkjVuCr9HR3mnwxrumZEpr5Y9JrU2uV48gSLpeJNKm",
        "amount": 721183797404
    },
    {
        "holder": "Hvs4RoQaMDdLiv6LN3PHiPgPN5Yjj5x5ELGy3v8crRBK",
        "amount": 11242851056831
    },
    {
        "holder": "G1BAN1NGLnJX8hXMTLGDtS9geJgPaTZjWY2j8b9MC6BU",
        "amount": 763136415881
    },
    {
        "holder": "ByYeJ51BYkQHfDwM85sA1mHYwNPfSJXfAADWGYTfjh6f",
        "amount": 4664913369
    },
    {
        "holder": "9f2cpExNh2Zp5HGdouQwvNNKdQqw7GTwcc7tGCAcbmrD",
        "amount": 5646861830578
    },
    {
        "holder": "54tkUt1s4SvSYKMvD5rJCcK6v81wqKwa2EHZ82sf6y6b",
        "amount": 1629876600164
    },
    {
        "holder": "FjV9PYXxcjtCRo5rfa69oBTRTsr1poFxcqcW9ieWfiY6",
        "amount": 1003796751184
    },
    {
        "holder": "9RBxnMxQwcyF1CVkAxNt5u59RqgX52ejZ6PrPfXXNXoG",
        "amount": 22000000000000
    },
    {
        "holder": "29kPNyLCfc9LEWsnB8SdAPktm189YDdTuiThFesFHKhx",
        "amount": 1194143475299
    },
    {
        "holder": "FxVVqvARW5rQgvDbfjPupt8Ta5LS6rSw2cMXUovU5Gvk",
        "amount": 292241152303
    },
    {
        "holder": "EPfQb2bboJZUELVi2k9WVKjZackt8SHotXQzsBdnA53R",
        "amount": 29032827432
    },
    {
        "holder": "DvFdm4kwZeopRHE2vLJ3BbUBQ8yq5utXH76kMJRNcXMr",
        "amount": 447937710133
    },
    {
        "holder": "E8mCd61TfmLNor8d2UMEPq4biCYJm1MsiqGRF58pUF5G",
        "amount": 4952601659650
    },
    {
        "holder": "2xRxyPD6eAPktGUmMLVcfyC9Jn98sFcHgjPdbTkRcWHQ",
        "amount": 1193304000562
    },
    {
        "holder": "AavEpAu11ANHjC17jfVDVqd1WbiWGYKYLwRNGaPBKyVn",
        "amount": 751888329191
    },
    {
        "holder": "8sDFVSJgxCqvL8qXD5JCLN7d5DyZUSHygp8GKgTvW7ZK",
        "amount": 5814862037693
    },
    {
        "holder": "39AVo2h4sjt81qatmuFi3mu1oFQUyhcwFX3RwqwtNRRU",
        "amount": 3646390891707
    },
    {
        "holder": "2PJ4iXUeEhccqPxzp8mQrgkMA9rm2pRtCzZqcpUQbc9q",
        "amount": 118065022259
    },
    {
        "holder": "66wEbRNqRCm62XexQ1DtbHfzei1Yq6HnALAup3kxjqNJ",
        "amount": 929151227914
    },
    {
        "holder": "FP5DncYKPZzfkmTBZyMWorThe4FPpemp9THpHVQyCTvy",
        "amount": 13333447056261
    },
    {
        "holder": "3eJkwFDZVB27emciij1oWUVodmFhFdnkpmzKHjDzH34o",
        "amount": 1000
    },
    {
        "holder": "AQCQVy6CfHV6z8eXvRY6mSpbYMbPPsRYdm4MZNrfQK6q",
        "amount": 252013599418
    },
    {
        "holder": "3u4CAiNQfAEkv2EdKJdAqEprneRPpCpXrwBCR9FwJxNS",
        "amount": 119902527490
    },
    {
        "holder": "DGDVmbrLNw9E6g1Gxb6V2zTJXTsTwipKEo3n5LYoedc6",
        "amount": 100000000000
    },
    {
        "holder": "J3uwfk7192zoSW6GEK9eTxwMhAacwZtM4YUwFvQFL4hz",
        "amount": 787618504354
    },
    {
        "holder": "CTKFXoog1e9oEE66M7nT4tio6JAsBWeADitUwvZ4fP81",
        "amount": 14739741261042
    },
    {
        "holder": "A9vnhdg2mzE3q3azgeF7ufFC3RBtN9737K9wbLVwXxd",
        "amount": 390241041131
    },
    {
        "holder": "AKhLBA3XAkN6Atafo3tXs4SmFZPM15Pce1xwTHDEKcpW",
        "amount": 448714807239
    },
    {
        "holder": "66i8zoehRxtysS1y2YLMbv3zBwQnfLnAr9w3k6TBJGHC",
        "amount": 118987798800
    },
    {
        "holder": "26pgdQaTdtsfiM8dQJnm9baCqrDWQUDfusEsGgcPKujw",
        "amount": 1280044398232
    },
    {
        "holder": "GHsojPSbfyNqbFSLhJajU4GnNRdNAtgjn8BDFKBYNzYL",
        "amount": 566140842668
    },
    {
        "holder": "HrNbBFvrzdpnVL4nZjuevf4TUAtNKZw8n3qvrKdaCiQU",
        "amount": 2459089735193
    },
    {
        "holder": "BnR2f6oT38HmcKTr89YHK2yFUz4XzSDrYiaqHLShgxAG",
        "amount": 2000000
    },
    {
        "holder": "H4dWNS7ydys4Je2G4WgsmJDSmqGtNmf8CT99r9rDnacf",
        "amount": 4900662942
    },
    {
        "holder": "CEvKwh2GMbTWdTqmyehczimu9ye8ibzWPubDBdEfU8XA",
        "amount": 4053531378322
    },
    {
        "holder": "Ch2uMKZo66EMRAUVkfq47wDzgrEZKyVTcyDtnEhiY27K",
        "amount": 679025478855
    },
    {
        "holder": "7ZYA7yRjmVzx56WAyZUH2vn5K3aJwKaagRmKmrzoWAdT",
        "amount": 529210376364
    },
    {
        "holder": "GG9P6RZfJUCndSkYSsLqE6MGhVePWL5LUEnvx7auXXng",
        "amount": 2918476369465
    },
    {
        "holder": "Hm1oraJrJM1PZQ51o9eFgKSd4HdDQ7JprikFSKRGcik1",
        "amount": 16227635269058
    },
    {
        "holder": "6nK8hpXoJhdLbMkCxRCcFYk8gCT6tL8DyxKJmqcZuptX",
        "amount": 15459931303
    },
    {
        "holder": "8NRK8dsaPmEryHsnarFMfKgyogHwHJY9SfXct6ofS1df",
        "amount": 2793503859896
    },
    {
        "holder": "FYQeYLN4eQkqzwQ4T8f4fCK4aYagi6NAeXmTnuoyT5LT",
        "amount": 10170953555
    },
    {
        "holder": "2vLJku9Ct8RYnTNnU13Q88sJenf9vyidwZGSpVFBhfbr",
        "amount": 616304880370
    },
    {
        "holder": "4nxEdbnMTrXFknTB8RoAYr28TLnEBjz5T9WV2kgRp57t",
        "amount": 5232837297505
    },
    {
        "holder": "9NP1j9QWQKTmfeqNaJLNa8c5gdZE3gDccXzWX4PSk2A2",
        "amount": 529618790289
    },
    {
        "holder": "EEcTMxBmFLU2eftqqjfi1q9R2Ypne6Tpgwm7znwY4kMX",
        "amount": 831041726028
    },
    {
        "holder": "BmanDqQELF7QY5uRPw8vg3eMjR74WZnszKmNbLJKkay3",
        "amount": 2860200750181
    },
    {
        "holder": "5niysgHXFoa8apmrgeBNRXJ6yPiz4WnMnVnAobUXoaMh",
        "amount": 536879096
    },
    {
        "holder": "CAwW6qa9fUPawUCvnCAms2G58NEAxLZNnSr8uxBXgve9",
        "amount": 3588408113607
    },
    {
        "holder": "2XqiLpzge5duQ6bkoHjyhLqZdgSkUjqgPVRQzS77KFg1",
        "amount": 9361779448
    },
    {
        "holder": "6SE72t2EZPBHxfGBkQgdR3zri5MWjhE2P9jPRjUSFQKM",
        "amount": 342663531913
    },
    {
        "holder": "3wsFxkueqNxECXwq4Tu23judonskYKzHEuR5AzqZo3ZV",
        "amount": 1034475182288
    },
    {
        "holder": "5kuyXgfw87rhjBwAMPAcDH4Gbh8ZX9wscZvvjZmjiRvX",
        "amount": 311654478450
    },
    {
        "holder": "CaShxDq2Vbdp2XryjDdUZthbTzwYsvKuH6Knn9pPi4xU",
        "amount": 210269123
    },
    {
        "holder": "12qXsHPo7ss1a9thC9mjBD2ya4MjZb3yij2zaa3AdD5b",
        "amount": 166466909728
    },
    {
        "holder": "AasoHP85u95AygsQcUb4xF4eHzbwL8dCWMi2b6yoUSFu",
        "amount": 5700243451988
    },
    {
        "holder": "DobZD6VZruyG7YrDgCE4BxiTUsho4dSUym4BDdPfhUVZ",
        "amount": 4987233399446
    },
    {
        "holder": "G1nXfsY4nx3oTmFRrTYPqb3HxXuXHjt64F8He3UebHku",
        "amount": 1233748434276
    },
    {
        "holder": "27bQJ982jRzBmsN3yh5PP1drMKJvouNhowyMMZ2MbqVk",
        "amount": 422521648117
    },
    {
        "holder": "6LxsudgaW7LjRHU8dbDMk65zjYevqwJFRLtoCbTU6XdH",
        "amount": 552665000000
    },
    {
        "holder": "Efqoo7tUd9bhrA8kEZ6YhtBbo2mhr6VLAKzQEsBTyUsk",
        "amount": 9130078840664
    },
    {
        "holder": "C9nCVfP8YbC57DVrv6uR3aVXKHeBevNJjEPFux4pvz53",
        "amount": 1470165851
    },
    {
        "holder": "J2yDjmuPuLaBCBhkFHWPawEPwYr5RoFtDjQWtbiZQbH1",
        "amount": 2853890029948
    },
    {
        "holder": "2cv8dwRNBpTS4myBt1KrpyVwhTrXU2LYJGWbxnqQHtpJ",
        "amount": 98795474145
    },
    {
        "holder": "daddyV1fGozkULzAbrA34nvkSxLky96uJiPeogbLH1v",
        "amount": 1
    },
    {
        "holder": "22g6rbRBs8CjpMRWKVgtTDmTikrXT21b9vTjdai4vr7D",
        "amount": 32958285303
    },
    {
        "holder": "2k4J6V6hHxnwTZRJeTN2ACZw8QbbVf7AioRuB6BqkaBi",
        "amount": 2428209836849
    },
    {
        "holder": "5UnFRNDbYbjH8Mdi1NWDHiw4KL9dzDgJrjvramf2chc6",
        "amount": 864702260437
    },
    {
        "holder": "6DnSMSR9nw6SafszjrguCKyiX6BLUtWRRz9GsrZxnZhJ",
        "amount": 189005801408
    },
    {
        "holder": "BGuyfAfRrTnigDD8ojKAMgvqqFC8NNm9vKW6aR5G4Nta",
        "amount": 1531482066938
    },
    {
        "holder": "MMQKSu4payRpJLWVgVZBztojNSZurXii5ywFKjzBfic",
        "amount": 30200934848925
    },
    {
        "holder": "7x4mpzfrUVrxtneJ6urG2Wd5uwPZSKSnC8bip4NpmKFZ",
        "amount": 2918868679403
    },
    {
        "holder": "4xu2vjQoXh4cArYQTMtWCPRGmZKkJL6WAW1chY9aNiqD",
        "amount": 212700529
    },
    {
        "holder": "gWiJhjG87dH4BXu6PgCvYqKPUBTzazW7t3tDZNH1Z2M",
        "amount": 203490878013
    },
    {
        "holder": "3nB6Zqbq7MxxFjiTYrd3TvX9A8zZrKqG9V8m42Ww9iUk",
        "amount": 1246145676361
    },
    {
        "holder": "3Fzn2AZbkVoVwxUkBJNaqea86Xa9Nyx5i4KFpgHrD3hc",
        "amount": 736504478093
    },
    {
        "holder": "AmYf7rcFSwKZvVwdsPiaNZpKiWJ8L3Tr4zmvDcsA18ix",
        "amount": 771071639229
    },
    {
        "holder": "Bc1PGtLcUyjvHyDrkSzoegV4e6WSf6YGQJgutJ6RqBA1",
        "amount": 8508276736534
    },
    {
        "holder": "BGTShgy3Ah9LVgD71WiE4E3o5HZXvgaCf8KhDUZL2pig",
        "amount": 3941039552743
    },
    {
        "holder": "FqdT6PuHoS9WpeZCU8W9C4Y7Bp96kvqdXDaHLGJn7FW",
        "amount": 601030132952
    },
    {
        "holder": "EYHEziFcX4DtXDHypddAqUm7fDyotQJTaAkNHHETj6Xn",
        "amount": 1124612460155
    },
    {
        "holder": "AFwzG5ucXb7WxnZrKaipqmzapkQ3orkHo11SKc8Vg8w",
        "amount": 3385002295605
    },
    {
        "holder": "FrVfLfjADYcJUoiPMTJfVCDXnECMHZGsv8BBVoJQbyk4",
        "amount": 828682890964
    },
    {
        "holder": "3ifN5oNC6K6ABut6XG2mRtaS1msgaR4X1NCSE2SQnMFr",
        "amount": 170013896313
    },
    {
        "holder": "EKmE4JLz3ndbp6vjcDefMmnRbzxRuSJeUDyiXmbLhMd3",
        "amount": 1364899800225
    },
    {
        "holder": "6caKMw4QsTAMnWsuDmJwjXgTeRK6FwRSDcuWMq55R9LV",
        "amount": 1021916246992
    },
    {
        "holder": "7HGwBPjoGBqHnSPqv2JF9QnySKuojmUKgH8hiHYGesQA",
        "amount": 12826085846789
    },
    {
        "holder": "E5T7MPYVMM43wU7K12NMXdKcyLkRmGE2eZit2KaSUeWh",
        "amount": 57668576496
    },
    {
        "holder": "6y8iuVDAaJxp9LvfFcR6t7G8fb3SVbVxrSdGMvwyByK5",
        "amount": 1562224847493
    },
    {
        "holder": "BBRKhdhwyySuvLhFbyyZnpasSRH5bKK4mVpM9XFkALYW",
        "amount": 1289411033537
    },
    {
        "holder": "5oA81Hgxc5pTETJwKiLsD68A6JPXBmv1ESrcmhhw9mFV",
        "amount": 14355854247120
    },
    {
        "holder": "31gxekRSnAWaGeFG4Q6qLDN3F1XxWXbbPVXhFXuAoURr",
        "amount": 280380380682
    },
    {
        "holder": "8HjZQuvcJTWDdHMy5fghq4mDC4gK8TYRQE1w9xfn3xJN",
        "amount": 349705484491
    },
    {
        "holder": "Hj2VWk9A6oA7KtGFs97FXn9LWtyJh2gKiGrd6Rs833AJ",
        "amount": 1160234162722
    },
    {
        "holder": "9H53Awjt77TWxFY6jRnPBNYwQhMSDqmUGkTwENoGARtU",
        "amount": 1579098266035
    },
    {
        "holder": "AZN5Abnyhpr8mTenuPwDHhEoKL5V21qRaPvibVQ7Aceh",
        "amount": 727787042957
    },
    {
        "holder": "G7qt4BeCrh9fiwneUUAEv1FbAZm4p4banxeZESPrMnBd",
        "amount": 381230255062
    },
    {
        "holder": "9o9BZMJnAPCsKkv3tSMPkUkRM9aC7sSucd6sx15Y1wip",
        "amount": 1682049465957
    },
    {
        "holder": "HDPdhf8id2GneuFjUVWEFRWty2tcjsyyzxfswWQY6C3w",
        "amount": 74712879812
    },
    {
        "holder": "Ghm1dh22oWkCvAk8ujUTAznZBRRUiLAYVtnyGjxqkdVN",
        "amount": 210915529747
    },
    {
        "holder": "FQKq8dvT73hXZR1YwetPgLcS5PZMeAU1TDzpFs2zKvk9",
        "amount": 88604894155
    },
    {
        "holder": "4TCbxMWCnhrzbRzFKYgMwWTpGqSbd9VNwgXdaoQYGH1i",
        "amount": 23743171378
    },
    {
        "holder": "GameykHjDGBDgnX3jubmubbkXHKFJkyUTfF2zrVRd1g9",
        "amount": 1605986077903
    },
    {
        "holder": "ELmYy1DkUVvWX7w3NyCvLSr4sBn6eLzjmvxms672bfKH",
        "amount": 3805839927527
    }
];

const GalaxyD3 = () => {
    const svgRef = useRef();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredHolders, setFilteredHolders] = useState(staticHolders);
  
    useEffect(() => {
      const width = window.innerWidth * 0.7;
      const height = window.innerHeight;
  
      const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "linear-gradient(135deg, #1f1c2c, #928dab)"); // A retro gradient
    
  
      svg.selectAll("*").remove(); // Clear previous drawings
  
      // Draw the central sun
      const sun = svg.append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", 15) // Increase size slightly
      .attr("fill", "yellow")
      .style("filter", "drop-shadow(0 0 10px rgba(255, 255, 0, 1))");
    
    function pulsate() {
      sun.transition()
        .duration(1000)
        .attr("r", 20)
        .style("filter", "drop-shadow(0 0 20px rgba(255, 255, 0, 1))")
        .transition()
        .duration(1000)
        .attr("r", 19)
        .style("filter", "drop-shadow(0 0 10px rgba(255, 255, 0, 1))")
        .on("end", pulsate);
    }
    
    pulsate(); // Start the pulsating effect
    
  
      // Generate orbit parameters for each holder
      const orbitData = filteredHolders.map((holder, index) => {
        const orbitRadius = 50 + Math.random() * (Math.min(width, height) / 2 - 50);
        const orbitSpeed = (0.001 + Math.random() * 0.002) / 2;
        const sizeScale = d3.scaleLinear()
          .domain([Math.min(...filteredHolders.map(h => h.amount)), Math.max(...filteredHolders.map(h => h.amount))])
          .range([2, 20]);
        const size = sizeScale(holder.amount);
        const initialAngle = Math.random() * 2 * Math.PI;
        return { ...holder, orbitRadius, orbitSpeed, size, angle: initialAngle };
      });
  
      // Create a tooltip element
// Create a tooltip element
    const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "rgba(0, 0, 0, 0.85)")
    .style("color", "#00ff00") // Retro green text
    .style("padding", "2px 4px") // Reduced padding for smaller size
    .style("border-radius", "2px")
    .style("font-family", "'Press Start 2P', sans-serif") // Retro font
    .style("font-size", "8px") // Smaller font size
    .style("pointer-events", "none")
    .style("opacity", 0)
    .style("transition", "opacity 0.2s ease");


      // Generate starry background
    for (let i = 0; i < 100; i++) {
        svg.append("circle")
        .attr("cx", Math.random() * width)
        .attr("cy", Math.random() * height)
        .attr("r", Math.random() * 2)
        .attr("fill", "rgba(255, 255, 255, 0.8)")
        .style("opacity", Math.random() * 0.8)
        .style("filter", "blur(1px)")
        .transition()
        .duration(5000 + Math.random() * 5000)
        .style("opacity", 0)
        .on("end", function() { d3.select(this).remove(); }); // Star fades out
    }
  
    
  
      // Function to update the position of each planet in its orbit
      const updateOrbits = () => {
        svg.selectAll(".trail")
        .data(orbitData)
        .join("circle")
        .attr("class", "trail")
        .attr("r", 3) // Adjust trail size as desired
        .attr("fill", "rgba(255, 255, 255, 0.5)") // Make trails semi-transparent
        .attr("cx", d => width / 2 + d.orbitRadius * Math.cos(d.angle))
        .attr("cy", d => height / 2 + d.orbitRadius * Math.sin(d.angle))
        .style("opacity", 0.2) // Make trails faint for a cool effect
        .transition()
        .duration(3000) // Duration controls how long the trails last
        .style("opacity", 0) // Fade out the trails
        .remove(); // Remove trails after fading out

        svg.selectAll(".planet")
          .data(orbitData)
          .join("circle")
          .attr("class", "planet")
          .attr("r", d => d.size)
          .attr("fill", (d, i) => `hsl(${(i * 40) % 360}, 100%, 50%)`)
          .attr("cx", d => width / 2 + d.orbitRadius * Math.cos(d.angle))
          .attr("cy", d => height / 2 + d.orbitRadius * Math.sin(d.angle))
          .on("mouseover", (event, d) => {
            tooltip.style("opacity", 1)
  .html(`<strong>Address:</strong> ${d.holder}<br><strong>Amount:</strong> ${d.amount}`);

          })
          .on("mousemove", (event) => {
            tooltip.style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 10) + "px");
          })
          .on("mouseout", () => {
            tooltip.style("opacity", 0);
          });
  
        orbitData.forEach(d => {
          d.angle += d.orbitSpeed;
        });
      };
  
      // Animation loop
      d3.timer(updateOrbits);
    }, [filteredHolders]);
  
    // Handle search input changes
// Handle search input changes
const handleSearchChange = (e) => {
    const query = e.target.value.trim().toLowerCase();
    setSearchQuery(query);

    // Filter holders based on substring match, not case sensitive
    if (query) {
        setFilteredHolders(
            staticHolders.filter((holder) => holder.holder.toLowerCase().includes(query))
        );
    } else {
        // If query is empty, show all holders
        setFilteredHolders(staticHolders);
    }
};

      
  
    return (
      <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#000' }}>
        {/* Visualization */}
        <div style={{ flex: 7, position: 'relative' }}>
          <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
        </div>
  
        {/* Sidebar for Search and Holder List */}
        <div style={{ flex: 3, padding: '10px', color: 'white', overflowY: 'auto', maxHeight: '100vh' }}>
          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for your address..."
            style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                fontFamily: "'Press Start 2P'",
                background: 'black',
                color: '#00ff00',
                borderRadius: '5px',
                border: '2px solid rgba(0, 255, 0, 0.8)', // Neon border effect
                boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)', // Glow shadow
                marginBottom: '10px',
                outline: 'none', // Remove default outline
            }}
            />


          
          {/* Holder List */}
          <div style={{ maxHeight: 'calc(100vh - 60px)', overflowY: 'auto' }}>
            {filteredHolders.length > 0 ? (
              filteredHolders.map((holder, index) => (
                <div key={index} style={{ marginBottom: '8px', padding: '5px', border: '1px solid #444', borderRadius: '5px' }}>
                  <div><strong>Address:</strong> {holder.holder}</div>
                  <div><strong>Amount:</strong> {holder.amount}</div>
                </div>
              ))
            ) : (
              <div style={{ color: '#888' }}>No results found</div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default GalaxyD3;