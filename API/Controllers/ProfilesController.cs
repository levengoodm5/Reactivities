using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Profiles;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query{Username = username}));
        }

        [HttpPut]
        public async Task<IActionResult> EditProfile(Edit.Command cmd)
        {
            return HandleResult(await Mediator.Send(cmd));
        }

        [HttpGet("{username}/activities")]
        public async Task<IActionResult> GetActivities(string predicate, string username)
        {
            return HandleResult(await Mediator.Send(new ListActivities.Query{Username = username, 
                Predicate = predicate}));
        }
    }
}